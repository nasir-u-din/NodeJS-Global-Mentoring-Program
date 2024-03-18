import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path'; 

function executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

function getSystemCommand(): string {
    if (process.platform === 'win32') {
        return `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"`;
    } else {
        return 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1';
    }
}

function appendToLogFile(data: string): void {
    const fileName = path.join(__dirname, 'activityMonitor.log');
    const currentTime = Math.floor(Date.now() / 1000);
    const logData = `${currentTime} : ${data}\n`;

    fs.appendFile(fileName, logData, (err) => {
        if (err) {
            console.error(`Error appending to ${fileName}: ${err}`);
        }
    });
}

async function monitorActivity(): Promise<void> {
    try {
        const command = getSystemCommand();
        const output = await executeCommand(command);
        process.stdout.write('\r' + output.trim().padEnd(process.stdout.columns));

        if (new Date().getSeconds() === 0) {
            appendToLogFile(output.trim());
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        setTimeout(monitorActivity, 100);
    }
}

monitorActivity();
