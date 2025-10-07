import { ObjectId } from 'mongodb';

export interface NodeServer {
    _id: ObjectId;
    courseId: ObjectId;
    parentId?: ObjectId | null;
    title: string;
    shortTitle?: string;
    synopsis: string;
    orderIndex: number;
    depth: number;
    tabOverviewMd?: string;
    tabDeepDiveMd?: string;
    tabTerminologyMd?: string;
    timeEstMinutes?: number;
    isDone: boolean;
    doneAt?: Date | null;
    lastViewedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type NodeCreate = Omit<NodeServer, '_id' | 'createdAt' | 'updatedAt'> & {
    createdAt: Date;
    updatedAt: Date;
};

export type NodeUpdate = Partial<Omit<NodeServer, '_id' | 'courseId'>> & {
    updatedAt: Date;
};

export interface NodeClient {
    _id: string;
    courseId: string;
    parentId?: string | null;
    title: string;
    shortTitle?: string;
    synopsis: string;
    orderIndex: number;
    depth: number;
    tabOverviewMd?: string;
    tabDeepDiveMd?: string;
    tabTerminologyMd?: string;
    timeEstMinutes?: number;
    isDone: boolean;
    doneAt?: string | null;
    lastViewedAt?: string | null;
    createdAt: string;
    updatedAt: string;
}


