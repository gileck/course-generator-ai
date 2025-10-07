import { Collection, ObjectId } from 'mongodb';
import { getDb } from '@/server/database';
import { NodeServer, NodeCreate, NodeUpdate } from './types';

const COLLECTION_NAME = 'nodes';

export const getNodesCollection = async (): Promise<Collection<NodeServer>> => {
    const db = await getDb();
    return db.collection<NodeServer>(COLLECTION_NAME);
};

export const createNode = async (node: NodeCreate): Promise<NodeServer> => {
    const collection = await getNodesCollection();
    const result = await collection.insertOne(node as NodeServer);
    if (!result.insertedId) throw new Error('Failed to create node');
    return { ...node, _id: result.insertedId } as NodeServer;
};

export const createNodesBulk = async (nodes: NodeCreate[]): Promise<NodeServer[]> => {
    const collection = await getNodesCollection();
    if (nodes.length === 0) return [];
    // Clone objects to avoid accidental mutation and satisfy typing
    const docs = nodes.map(n => ({ ...n })) as unknown as NodeServer[];
    const result = await collection.insertMany(docs);
    const ids = Object.values(result.insertedIds) as ObjectId[];
    return docs.map((doc, idx) => ({ ...doc, _id: ids[idx] }));
};

export const findNodeById = async (
    nodeId: ObjectId | string
): Promise<NodeServer | null> => {
    const collection = await getNodesCollection();
    const id = typeof nodeId === 'string' ? new ObjectId(nodeId) : nodeId;
    return collection.findOne({ _id: id });
};

export const findChildren = async (
    courseId: ObjectId | string,
    parentId: ObjectId | string | null
): Promise<NodeServer[]> => {
    const collection = await getNodesCollection();
    const cId = typeof courseId === 'string' ? new ObjectId(courseId) : courseId;
    const pId = parentId === null ? null : (typeof parentId === 'string' ? new ObjectId(parentId) : parentId);
    return collection
        .find({ courseId: cId, parentId: (pId as ObjectId | null) })
        .sort({ orderIndex: 1 })
        .toArray();
};

export const updateNode = async (
    nodeId: ObjectId | string,
    update: NodeUpdate
): Promise<NodeServer | null> => {
    const collection = await getNodesCollection();
    const id = typeof nodeId === 'string' ? new ObjectId(nodeId) : nodeId;
    const result = await collection.findOneAndUpdate(
        { _id: id },
        { $set: update },
        { returnDocument: 'after' }
    );
    return result || null;
};


