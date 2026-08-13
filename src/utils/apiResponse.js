export const unwrapData = (response, fallback = null) => {

    const body = response?.data;

    if (body === null || body === undefined) {
        return fallback;
    }

    if (
        typeof body === "object" &&
        "success" in body &&
        "data" in body
    ) {
        return body.data ?? fallback;
    }

    return body;

};

export const unwrapContent = (response) => {

    const data = unwrapData(response);

    if (Array.isArray(data)) {
        return data;
    }

    return data?.content ?? [];

};

export const unwrapTotalPages = (response) =>
    unwrapData(response)?.totalPages ?? 0;
