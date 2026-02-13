export function normalizeResponses(
  responses: Array<{
    data: Record<string, any>;
    createdAt: string;
  }>,
): Array<Record<string, any>> {
    return responses.map((response)=>({
        ...response.data,
        submitted_at : new Date(response.createdAt).toLocaleString()
    }));
}
