class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        const queryObj = { ...this.quertString };
        const execludedFields = ['page', 'limit', 'sort', 'fields'];
        execludedFields.forEach(el => delete queryObj[el]);

        const keys = ['name', 'email'];
        keys.forEach(key => {
            if(queryObj[key])
                queryObj[key] = { $regex: queryObj[key], $options: 'i' };
        });
        this.query = this.query.find(queryObj);
        return this;
    };

    sort(){
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    };

    limitedFields(){
        if(this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this;
    };

    paginate(){
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    };
}

module.exports = APIFeatures;