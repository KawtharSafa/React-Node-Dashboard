import fs from 'fs';
import path from 'path';

const filePath = path.resolve("data/users.json");

export const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        if (!data.trim()) {
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading users from file:", error);
        return [];
    }
};

export const writeUsersToFile = (users) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
        console.error("Error writing users to file:", error);
    }
};
