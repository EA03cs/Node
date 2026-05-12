export const findone = async ({model, filter= {},select = "" , populate = []}={}) => {
    return await model.findOne(filter).select(select).populate(populate);
};

export const create = async ({model, data = {} , options = {validateBeforeSave: false}}={}) => {
    return await model.create(data, options);
};

export const find = async ({model, filter= {},select = "" , populate = []}={}) => {
    return await model.find(filter).select(select).populate(populate);
};

export const findByIdAndUpdate = async ({model, id, data = {}, options = {new: true}}={}) => {
    return await model.findByIdAndUpdate(id, data, options);
};