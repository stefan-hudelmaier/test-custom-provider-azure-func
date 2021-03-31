const SHARED_ACCESS_POLICY_TYPE = 'Microsoft.CustomProviders/resourceProviders/public/sharedAccessPolicies';
const ROOT_TOKEN_TYPE = 'Microsoft.CustomProviders/resourceProviders/public/rootTokens';
const WEBSOCKET_URL_TYPE = 'Microsoft.CustomProviders/resourceProviders/public/websocketUrls';

const {
    ACI_FQDN,
} = process.env;

const WEBSOCKET_URL = `http://${ACI_FQDN}`;
const CONNECTION_STRING = `Endpoint=http://${ACI_FQDN}/admin;SharedAccessKey=123`;

function readSharedAccessPolicy(customProviderRequestPath) {
    return {
        name: 'Primary',
        id: `${customProviderRequestPath}`,
        type: SHARED_ACCESS_POLICY_TYPE,
        properties: {
            connectionString: CONNECTION_STRING
        }
    }
}

function readAllSharedAccessPolicies(customProviderRequestPath) {
    return {
        value: [{
            name: "Primary",
            id: `${customProviderRequestPath}/primary`,
            type: SHARED_ACCESS_POLICY_TYPE,
            properties: {
                connectionString: CONNECTION_STRING
            }
        }, {
            name: "Secondary",
            id: `${customProviderRequestPath}/secondary`,
            type: SHARED_ACCESS_POLICY_TYPE,
            properties: {
                connectionString: CONNECTION_STRING
            }
        }]
    }
}

function readRootToken(customProviderRequestPath) {
    return {
        name: 'rootToken1',
        id: `${customProviderRequestPath}`,
        type: ROOT_TOKEN_TYPE,
        properties: {
            value: "rt-123456789"
        }
    }
}

function readAllRootTokens(customProviderRequestPath) {
    return {
        value: [{
            name: "rootToken1",
            id: `${customProviderRequestPath}/rootToken1`,
            type: ROOT_TOKEN_TYPE,
            properties: {
                value: "rt-123456789"
            }
        }, {
            name: "rootToken2",
            id: `${customProviderRequestPath}/rootToken2`,
            type: ROOT_TOKEN_TYPE,
            properties: {
                value: "rt-9887654321"
            }
        }]
    }
}

function readWebsocketUrl(customProviderRequestPath) {
    return {
        name: 'url',
        id: `${customProviderRequestPath}`,
        type: WEBSOCKET_URL_TYPE,
        properties: {
            value: WEBSOCKET_URL
        }
    }
}

function readAllWebsocketUrls(customProviderRequestPath) {
    return {
        value: [{
            name: "url",
            id: `${customProviderRequestPath}/url`,
            type: WEBSOCKET_URL_TYPE,
            properties: {
                value: WEBSOCKET_URL
            }
        }]
    }
}

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

    const customProviderRequestPathParts = customProviderRequestPath.split('/');

    const isResourceRequest = customProviderRequestPathParts.length % 2 === 1;

    const resourceType = isResourceRequest ? customProviderRequestPathParts[customProviderRequestPathParts.length - 2] : customProviderRequestPathParts[customProviderRequestPathParts.length - 1];

    console.log(`Resource type: ${resourceType}`);

    let responseBody = null;
    if (resourceType === 'sharedAccessPolicies') {
        if (isResourceRequest) {
            responseBody = readSharedAccessPolicy(customProviderRequestPath);
        } else {
            responseBody = readAllSharedAccessPolicies(customProviderRequestPath)
        }
    } else if (resourceType === 'rootTokens') {
        if (isResourceRequest) {
            responseBody = readRootToken(customProviderRequestPath);
        } else {
            responseBody = readAllRootTokens(customProviderRequestPath)
        }
    } else if (resourceType === 'websocketUrls') {
        if (isResourceRequest) {
            responseBody = readWebsocketUrl(customProviderRequestPath);
        } else {
            responseBody = readAllWebsocketUrls(customProviderRequestPath)
        }
    }

    if (responseBody === null) {
        context.res = {
            status: 400,
            body: `Invalid resource type: ${resourceType}`
        }
        context.done;
        return;
    }

    context.res = {
        headers: {
            'Content-Type': 'application/json'
        },
        body:  responseBody
    };

    context.done();
}
