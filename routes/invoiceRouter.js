const express = require('express');
const invoiceController = require('../controllers/invoiceController')
const stockController = require('../controllers/stockController')

function routes(Invoice, AutoPart) {
    const invoiceRouter = express.Router();
    const invoiceControl = invoiceController(Invoice)
    const stockControl = stockController(AutoPart)
    invoiceRouter.route('/')
        .post((req, res) => {
            stockControl.reduceUsedAutoPartsInStock(req.body.autoPartsFromStock);
            invoiceControl.post(req, res);
        })
        .get(invoiceControl.getAll);

    invoiceRouter.route('/invoiceList')
        .post((req, res) => {
            invoiceControl.postList(req, res);
        })


    invoiceRouter.route('/carInfo')
        .get(invoiceControl.getCarInfo)

    invoiceRouter.route('/historyOfAutoParts')
        .get(invoiceControl.getAllAutoPartsAndTheirDates)

    invoiceRouter.use('/:invoiceId', (req, res, next) =>  {
        console.log(req.params.invoiceId)
        Invoice.findById(req.params.invoiceId, (err, invoice) => {

            if(err) {
                return res.send(err);
            }
            if(invoice) {
                req.invoice = invoice;
                return next();
            }
            return res.sendStatus(404);
        });
    });
    invoiceRouter.route('/:invoiceId')
        .get((req, res) => res.json(req.invoice))
        .put((req , res) => {
            const { invoice } = req;
            if(req.body._id) delete req.body._id;
            Object.entries(req.body).forEach(item => {
                const key  = item[0];
                const value = item[1];
                invoice[key] = value;
            })
            req.invoice.save((err) => {
                if(err) {
                    return res.send(err)
                }
                return res.json(invoice)
            })
        })
        .patch((req, res) => {
            const { invoice } = req;

            if(req.body._id) delete req.body._id;
            Object.entries(req.body).forEach(item => {
                const key  = item[0];
                const value = item[1];
                invoice[key] = value;
            })
            req.invoice.save((err) => {
                if(err) {
                    return res.send(err)
                }
                return res.json(invoice)
            })
        })
        .delete((req, res) => {
            req.invoice.remove((err) => {
                if(err) return res.send(err)
                return res.sendStatus(204);
            })
        })

    return invoiceRouter;
}

module.exports = routes;
