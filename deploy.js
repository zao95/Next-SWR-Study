const {
    S3Client,
    PutObjectCommand,
    ListObjectsCommand,
    DeleteObjectsCommand,
} = require('@aws-sdk/client-s3')
const { CloudFrontClient, CreateInvalidationCommand } = require('@aws-sdk/client-cloudfront')
const fs = require('fs')
const glob = require('glob')
const md5 = require('md5')

const REGION = 'ap-northeast-2'
const DistributionId = process.env.DISTRIBUTION_ID
const bucketParams = {
    Bucket: process.env.S3_BUCKET,
}

const createClient = async (loadProcess) => {
    const s3 = new S3Client({
        region: REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID.replace(" ", ""),
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.replace(" ", ""),
        },
    })
    const cf = new CloudFrontClient({
        region: REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID.replace(" ", ""),
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.replace(" ", ""),
        }
    })
    return [s3, cf]
}

const s3ListRead = async (s3) => {
    try {
        const s3ObjectList = []
        const data = await s3.send(new ListObjectsCommand(bucketParams))
        if (data.Contents) {
            for (let i of data.Contents) {
                s3ObjectList.push(i.Key)
            }
        }
        return s3ObjectList
    } catch (e) {
        console.log(e)
    }
}

const s3Delete = async (s3, files) => {
    const deleteParams = {
        ...bucketParams,
        Delete: { Objects: [] }
    }
    for (let file of files) {
        deleteParams.Delete.Objects.push({ 'Key': file })
    }
    try {
        await s3.send(new DeleteObjectsCommand(deleteParams))
    } catch (err) {
        console.log('Error', err)
    }
}

const s3Upload = async (s3) => {
    const files = glob.sync(`./out/**/*.*`)
    for (let file of files) {
        const uploadParams = { ...bucketParams }
        const body = fs.readFileSync(file)
        uploadParams['Key'] = file.replace('./out/', '')
        uploadParams['ACL'] = 'public-read'
        uploadParams['Body'] = body
        if (file.match(/\.html$/)) {
            uploadParams['ContentType'] = 'text/html'
            if (!(file.match(/^\.\/out\/404\.html/) || file.match(/^\.\/out\/index\.html/))) {
                uploadParams['Key'] = uploadParams['Key'].replace('.html', '')
            }
        }

        try {
            await s3.send(new PutObjectCommand(uploadParams))
        } catch (err) {
            console.log('Error', err)
        }
    }
}

const cfInvalidation = async (cf) => {
    await cf.send(new CreateInvalidationCommand({
        DistributionId,
        InvalidationBatch: {
            CallerReference: String(md5(new Date().toString())),
            Paths: {
                Items: [
                    '/*',
                ],
                Quantity: 1,
            },
        }
    }))
}

const timer = () => {
    const timer = setInterval(() => {
        process.stdout.write('.')
    }, 100)
    const clearTimer = () => {
        clearInterval(timer)
    }
    return clearTimer
}

const loadProcess = async (name, func, params = []) => {
    const time = timer()
    process.stdout.write(`${name} start...`)
    try {
        const result = await func(...params)
        process.stdout.write(`complete\n`)
        return result
    } catch (e) {
        process.stdout.write(`error\n`)
        throw Error(e)
    } finally {
        time()
    }
}

const deploy = async () => {
    try {
        const [s3, cf] = await loadProcess('createClient', createClient)
        const s3List = await loadProcess('s3ListRead', s3ListRead, [s3])
        s3List?.Contents?.length && await loadProcess('s3Delete', s3Delete, [s3, s3List])
        await loadProcess('s3Upload', s3Upload, [s3])
        await loadProcess('cfInvalidation', cfInvalidation, [cf])
    } catch (e) {
        process.stdout.write(e)
        throw new Error(e)
    }
}

deploy()