class SearchFeatures {
  constructor(query, queryString) {
    this.queryString = queryString;
    this.query = query;
  }

  _filterFields() {
    const copyQueryStr = { ...this.queryString };
    const excludeFields = [
      "page",
      "sort",
      "limit",
      "fields",
    ];
    excludeFields.forEach((el) => delete copyQueryStr[el]);
    for (let key in copyQueryStr) {
      if (!copyQueryStr[key].includes(","))
        return copyQueryStr;

      copyQueryStr[key] = ("$" + copyQueryStr[key]).split(
        ","
      );
      copyQueryStr[key] = Object.fromEntries([
        copyQueryStr[key],
      ]);
    }

    return copyQueryStr;
  }

  filter() {
    const filteredQueryStr = this._filterFields();
    this.query.find(filteredQueryStr);
    return this;
  }

  limitFields() {
    let selectedFields = this.queryString.fields || "";
    selectedFields = selectedFields.split(",");
    this.query.select(selectedFields);
    return this;
  }

  paginate() {
    const limit = +this.queryString.limit || 100;
    const page = +this.queryString.page || 1;
    const skip = page * limit - limit;
    this.query.skip(skip).limit(limit);
    return this;
  }

  sort() {
    let sortField = this.queryString.sort || "";
    sortField = sortField.replace(",", " ");
    this.query.sort(sortField);
    return this;
  }

  execute() {
    return this.query.exec();
  }
}

module.exports = SearchFeatures;
