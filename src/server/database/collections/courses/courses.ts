import { Collection, ObjectId } from 'mongodb';
import { getDb } from '@/server/database';
import { CourseServer, CourseCreate, CourseUpdate } from './types';

const COLLECTION_NAME = 'courses';

export const getCoursesCollection = async (): Promise<Collection<CourseServer>> => {
    const db = await getDb();
    return db.collection<CourseServer>(COLLECTION_NAME);
};

export const createCourse = async (course: CourseCreate): Promise<CourseServer> => {
    const collection = await getCoursesCollection();
    const result = await collection.insertOne(course as CourseServer);
    if (!result.insertedId) throw new Error('Failed to create course');
    return { ...course, _id: result.insertedId } as CourseServer;
};

export const findCourseById = async (
    courseId: ObjectId | string
): Promise<CourseServer | null> => {
    const collection = await getCoursesCollection();
    const id = typeof courseId === 'string' ? new ObjectId(courseId) : courseId;
    return collection.findOne({ _id: id });
};

export const findCoursesByUser = async (
    userId?: ObjectId | string
): Promise<CourseServer[]> => {
    const collection = await getCoursesCollection();
    if (!userId) {
        return collection.find({}).sort({ updatedAt: -1 }).toArray();
    }
    const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    return collection.find({ createdByUserId: id }).sort({ updatedAt: -1 }).toArray();
};

export const updateCourse = async (
    courseId: ObjectId | string,
    update: CourseUpdate
): Promise<CourseServer | null> => {
    const collection = await getCoursesCollection();
    const id = typeof courseId === 'string' ? new ObjectId(courseId) : courseId;
    const result = await collection.findOneAndUpdate(
        { _id: id },
        { $set: update },
        { returnDocument: 'after' }
    );
    return result || null;
};

export const deleteCourseById = async (
    courseId: ObjectId | string
): Promise<boolean> => {
    const collection = await getCoursesCollection();
    const id = typeof courseId === 'string' ? new ObjectId(courseId) : courseId;
    const result = await collection.deleteOne({ _id: id });
    return result.deletedCount === 1;
};


