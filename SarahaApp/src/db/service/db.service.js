export const findone = async ({model, filter= {},select = "" , populate = []}={}) => {
    return await model.findOne(filter).select(select).populate(populate);
};

export const create = async ({model, data = {} , options = {validateBeforeSave: false}}={}) => {
    return await model.create(data, options);
};