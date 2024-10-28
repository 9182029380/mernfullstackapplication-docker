import { ConflictError, UnauthorizedError } from "../errors/http_errors";
import { Note } from "../models/note";
import { User } from "../models/user";

const API_BASE_URL = "/api";

async function fetchData(input: string, init?: RequestInit) {
    try {
        const response = await fetch(`${API_BASE_URL}${input}`, init);
        const contentType = response.headers.get("content-type");

        if (response.ok) {
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            }
            throw new Error("Expected JSON response, but received non-JSON.");
        } else {
            const rawText = await response.text(); // Log raw text
            console.error(`Error Response: ${rawText}`); // Log for debugging
            let errorBody;
            try {
                errorBody = JSON.parse(rawText);
            } catch (e) {
                throw new Error(`Failed to parse JSON: ${rawText}`);
            }
            const errorMessage = errorBody.error || "An unknown error occurred.";
            throw new Error(`Request failed with status: ${response.status} message: ${errorMessage}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Network error: ${error.message}`);
        } else {
            throw new Error(`Unknown error occurred: ${String(error)}`);
        }
    }
}
export async function getLoggedInUser(): Promise<User> {
    const response = await fetchData("/users", { method: "GET" });
    return response.json();
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await fetchData("/users/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await fetchData("/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    return response.json();
}

export async function logout(): Promise<void> {
    await fetchData("/users/logout", { method: "POST" });
}

export async function fetchNotes(): Promise<Note[]> {
    const response = await fetchData("/notes", { method: "GET" });
    return response.json();
}

export interface NoteInput {
    title: string,
    text?: string,
}

export async function createNote(note: NoteInput): Promise<Note> {
    const response = await fetchData("/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    return response.json();
}

export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
    const response = await fetchData(`/notes/${noteId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    return response.json();
}

export async function deleteNote(noteId: string): Promise<void> {
    await fetchData(`/notes/${noteId}`, { method: "DELETE" });
}
