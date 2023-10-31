import {API_URL} from "./config/config.js";

class ExecutionAPI {
    async saveExecution(execution) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/api/execution`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({execution})
        });

        const responseObj = await response.json();

        if (!responseObj.hasOwnProperty("execution")) {
            throw new Error((responseObj.hasOwnProperty("message")) ? responseObj.message
                : "Error saving execution");
        }

        return responseObj.execution;
    }

    async updateExecution(execution) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/api/execution`, {
            method: 'PUT',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({execution})
        });

        const responseObj = await response.json();

        if (!responseObj.hasOwnProperty("execution")) {
            throw new Error((responseObj.hasOwnProperty("message")) ? responseObj.message
                : "Error updating execution");
        }

        return responseObj.execution;
    }

    async deleteExecution(executionId) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/api/execution/${executionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${token}`,
            }
        });

        const responseObj = await response.json();

        if (!responseObj.hasOwnProperty("result")) {
            throw new Error((responseObj.hasOwnProperty("message")) ? responseObj.message
                : "Error deleting execution");
        }

        return responseObj.result;
    }

    async getExecutionsForUser() {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/api/execution/all`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
            }
        });

        const responseObj = await response.json();

        if (!responseObj.hasOwnProperty("executions")) {
            throw new Error((responseObj.hasOwnProperty("message")) ? responseObj.message
                : "Error getting executions");
        }

        return responseObj.executions;
    }
}

export default new ExecutionAPI();