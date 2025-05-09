const { ZapClient } = require('zaproxy');

const zapOptions = {
    apiKey: 'your-api-key', // You'll get this from ZAP
    proxy: {
        host: 'localhost',
        port: 8080
    }
};

const zaproxy = new ZapClient(zapOptions);

async function runSecurityTests() {
    try {
        // Start a new session
        await zaproxy.core.newSession();
        
        // Set the target URL
        const targetUrl = 'http://localhost:5000';
        await zaproxy.core.accessUrl(targetUrl);
        
        // Run the spider
        console.log('Starting spider scan...');
        const spiderScanId = await zaproxy.spider.scan(targetUrl);
        await waitForSpiderToComplete(spiderScanId);
        
        // Run the active scan
        console.log('Starting active scan...');
        const activeScanId = await zaproxy.ascan.scan(targetUrl);
        await waitForActiveScanToComplete(activeScanId);
        
        // Get the alerts
        const alerts = await zaproxy.core.alerts();
        
        // Generate report
        const report = await zaproxy.reports.generate(
            'Security Test Report',
            'Traditional-PDF',
            'Traditional-PDF',
            null,
            null
        );
        
        console.log('Security test completed. Check the report for details.');
        return alerts;
    } catch (error) {
        console.error('Security test failed:', error);
        throw error;
    }
}

async function waitForSpiderToComplete(scanId) {
    while (true) {
        const status = await zaproxy.spider.status(scanId);
        if (status >= 100) break;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function waitForActiveScanToComplete(scanId) {
    while (true) {
        const status = await zaproxy.ascan.status(scanId);
        if (status >= 100) break;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

module.exports = { runSecurityTests }; 