export const buildDraft = (items = []) => {

    const draft = {
        items: {},
        batches: {}
    };

    items.forEach((item) => {

        draft.items[item.id] = {
            physicalQuantity:
                item.physicalQuantity === null ||
                item.physicalQuantity === undefined
                    ? ""
                    : String(item.physicalQuantity),
            reason: item.reason ?? ""
        };

        (item.batches ?? []).forEach((batch) => {

            draft.batches[batch.id] = {
                physicalQuantity:
                    batch.physicalQuantity === null ||
                    batch.physicalQuantity === undefined
                        ? ""
                        : String(batch.physicalQuantity),
                reason: batch.reason ?? ""
            };

        });

    });

    return draft;

};

export const parseQuantity = (value) => {

    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed >= 0
        ? parsed
        : null;

};

export const resolveItemQuantity = (item, draft) => {

    if (!item.batchManaged) {

        return parseQuantity(
            draft.items[item.id]?.physicalQuantity
        );

    }

    const batches = item.batches ?? [];

    if (batches.length === 0) {
        return null;
    }

    let total = 0;

    for (const batch of batches) {

        const quantity = parseQuantity(
            draft.batches[batch.id]?.physicalQuantity
        );

        if (quantity === null) {
            return null;
        }

        total += quantity;

    }

    return total;

};

export const resolveItemStatus = (systemQuantity, physicalQuantity) => {

    if (physicalQuantity === null) {
        return null;
    }

    return physicalQuantity - Number(systemQuantity ?? 0) === 0
        ? "MATCHED"
        : "DISCREPANCY";

};

const savedQuantity = (record) =>
    record.physicalQuantity === null ||
    record.physicalQuantity === undefined
        ? null
        : Number(record.physicalQuantity);

/*
 * While the sheet is editable the counted numbers only live in the draft,
 * so the quantity, variance, status and reason shown on screen must be
 * derived from it. Once the count is confirmed the record itself is the
 * source of truth. Both the tables and the Excel/print export read a row
 * through these helpers so they can never disagree.
 */
export const resolveItemView = (item, draft, editable) => {

    if (!editable) {

        const physicalQuantity = savedQuantity(item);

        return {
            physicalQuantity,
            variance:
                physicalQuantity === null
                    ? null
                    : Number(item.varianceQuantity ?? 0),
            status: item.itemStatus,
            reason: item.reason ?? ""
        };

    }

    const physicalQuantity = resolveItemQuantity(item, draft);

    return {
        physicalQuantity,
        variance:
            physicalQuantity === null
                ? null
                : physicalQuantity - Number(item.systemQuantity ?? 0),
        status: resolveItemStatus(item.systemQuantity, physicalQuantity),
        reason: draft.items[item.id]?.reason ?? ""
    };

};

export const resolveBatchView = (batch, draft, editable) => {

    if (!editable) {

        const physicalQuantity = savedQuantity(batch);

        return {
            physicalQuantity,
            variance:
                physicalQuantity === null
                    ? null
                    : Number(batch.varianceQuantity ?? 0),
            reason: batch.reason ?? ""
        };

    }

    const physicalQuantity = parseQuantity(
        draft.batches[batch.id]?.physicalQuantity
    );

    return {
        physicalQuantity,
        variance:
            physicalQuantity === null
                ? null
                : physicalQuantity - Number(batch.systemQuantity ?? 0),
        reason: draft.batches[batch.id]?.reason ?? ""
    };

};

export const collectInvalidQuantities = (items = [], draft) => {

    const invalid = [];

    items.forEach((item) => {

        if (item.batchManaged) {

            (item.batches ?? []).forEach((batch) => {

                const raw = draft.batches[batch.id]?.physicalQuantity;

                if (parseQuantity(raw) === null) {
                    invalid.push(`${item.code} · lô ${batch.lotNumber || "-"}`);
                }

            });

            if ((item.batches ?? []).length === 0) {
                invalid.push(item.code);
            }

            return;

        }

        const raw = draft.items[item.id]?.physicalQuantity;

        if (parseQuantity(raw) === null) {
            invalid.push(item.code);
        }

    });

    return invalid;

};

export const buildCountPayload = (items = [], draft) => ({

    items: items.map((item) => ({
        id: item.id,
        physicalQuantity: item.batchManaged
            ? null
            : parseQuantity(draft.items[item.id]?.physicalQuantity),
        reason: draft.items[item.id]?.reason?.trim() || null
    })),

    batches: items.flatMap((item) =>
        (item.batches ?? []).map((batch) => ({
            id: batch.id,
            physicalQuantity: parseQuantity(
                draft.batches[batch.id]?.physicalQuantity
            ),
            reason: draft.batches[batch.id]?.reason?.trim() || null
        }))
    )

});
