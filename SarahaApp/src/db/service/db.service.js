export const findone = async ({model, filter= {},select = ""}={}) => {
    return await model.findOne(filter).select(select);
};

