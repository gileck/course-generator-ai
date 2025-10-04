const isProduction = process.env.NODE_ENV === 'production';

export const appConfig = {
    appName: 'course-generator-ai',
    cacheType: isProduction ? 's3' : 's3',
    dbName: 'course_generator_ai_db'
};
