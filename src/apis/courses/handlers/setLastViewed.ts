// context intentionally unused (auth optional)
import { SetLastViewedRequest, SetLastViewedResponse } from '../types';
import { nodes } from '@/server/database/collections';

export const setLastViewed = async (
    params: SetLastViewedRequest
): Promise<SetLastViewedResponse> => {
    const now = new Date();
    await nodes.updateNode(params.node_id, { lastViewedAt: now, updatedAt: now });
    return { success: true };
};


