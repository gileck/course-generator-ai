import { ObjectId } from 'mongodb';

/**
 * Course document stored in MongoDB (server-side shape)
 */
export interface CourseServer {
    _id: ObjectId;
    title: string;
    shortTitle?: string;
    overviewSummary: string;
    overviewDetail: string;
    difficulty?: string; // optional for MVP
    createdByUserId?: ObjectId; // optional for single-user MVP
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Course create payload (server-side)
 */
export type CourseCreate = Omit<CourseServer, '_id' | 'createdAt' | 'updatedAt'> & {
    createdAt: Date;
    updatedAt: Date;
};

/**
 * Course update payload (server-side)
 */
export type CourseUpdate = Partial<Omit<CourseServer, '_id'>> & {
    updatedAt: Date;
};

/**
 * Client-friendly course shape (string IDs and ISO timestamps)
 */
export interface CourseClient {
    _id: string;
    title: string;
    shortTitle?: string;
    overviewSummary: string;
    overviewDetail: string;
    difficulty?: string;
    createdByUserId?: string;
    createdAt: string;
    updatedAt: string;
}


