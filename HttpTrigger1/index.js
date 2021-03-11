module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log("Context: ", JSON.stringify(context, null, 2));
    context.log("Request: ", JSON.stringify(req, null, 2));

    const customProviderRequestPath = req.headers['x-ms-customproviders-requestpath'];

    if (!customProviderRequestPath) {
        context.res = {
            status: 400,
            body: "Header x-ms-customproviders-requestpath is missing"
        }
        context.done;
        return;
    }

    if (req.method !== 'GET') {
        context.res = {
            status: 400,
            body: "Only GETs are supported currently"
        }
        context.done;
        return;
    }
    const isResourceRequest = customProviderRequestPath.split('/').length % 2 === 1;

    let responseBody;
    if (isResourceRequest) {
        responseBody = {
            name: 'Test',
            properties: {
                age: 39
            }
        }
    } else {
        responseBody = {
            value: [{
                name: "Test",
                properties: {
                    age: 39
                }
            }, {
                name: "Test2",
                properties: {
                    age: 41
                }
            }]
        }
    }

    context.res = {
        headers: {
            'Content-Type': 'application/json'
        },
        body:  responseBody
    };

    context.done();
}
