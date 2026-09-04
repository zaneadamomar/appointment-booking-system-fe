import { User } from "../types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/api/GetUsers`, {
        method: "GET",
        headers: {
            Accept: "*/*",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to retrieve users. Status: ${response.status}`);
    }

    return response.json();
}