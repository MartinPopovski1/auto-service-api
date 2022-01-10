function stockController(AutoPart) {
    function post(req, res) {
        const autoPart = new AutoPart(req.body);
        if(!req.body.name) {
            res.status(400);
            return res.send('Name is required');
        }

        autoPart.save();
        res.status(201)
        return res.json(autoPart);
    }
    function getAll(req, res) {
        const query = {};
        if(req.query.name) {
            query.name = req.query.name;
        }
        AutoPart.find(query, (err, autoParts) => {
            if(err) {
                return res.send(err);
            }
            return res.json(autoParts);
        });
    }
    function reduceUsedAutoPartsInStock(invoiceAutoPartList, req, res) {
        console.log(invoiceAutoPartList)
        if(invoiceAutoPartList && invoiceAutoPartList.length) {
            invoiceAutoPartList.forEach(autoPart => {
                console.log(autoPart)
                AutoPart.findOne({name: autoPart.name, brand: autoPart.brand }, function(err, dbAutoPart) {
                    console.log(dbAutoPart)
                    if(err) {
                        return false;
                    }
                    if(dbAutoPart) {
                        let quantityNumber = parseInt(dbAutoPart.quantity) - parseInt(autoPart.quantity);
                        if(quantityNumber < 0) {
                            res.status(400);
                            return res.send('Нема доволно од делот: ' + dbAutoPart.name + ' во магацин');
                        }
                        else {
                            dbAutoPart.quantity = quantityNumber.toString();
                            dbAutoPart.save((err) => {
                                console.log(err);
                                return !err;
                            })
                        }
                    }
                    return false;
                });
            })
        }
        return false;

    }

    return { post, getAll, reduceUsedAutoPartsInStock };
}

module.exports = stockController;
