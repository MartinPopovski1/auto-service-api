function invoiceController(Invoice) {
    function post(req, res) {
        const invoice = new Invoice(req.body);
        if(!req.body.registrationNumber) {
            res.status(400);
            return res.send('Registration number is required');
        }

        invoice.save();
        res.status(201)
        return res.json(invoice);
    }
    function postList(req, res) {

        if(!req.body.invoiceList && !req.body.invoiceList.length) return;

        Invoice.find({}, 'owner registrationNumber date', (err, invoices) => {
            if(err) {
                console.log(err);
                return;
            }
            let sameInvoice;
            for (const invoiceElement of req.body.invoiceList) {
                if(!invoiceElement.registrationNumber) {
                    res.status(400);
                    return res.send('Нема внесено регистрација во фактура со сопственик: ' + invoiceElement.owner);
                }
                sameInvoice = invoices.find(invoice => invoice.registrationNumber === invoiceElement.registrationNumber
                    && invoice.date === invoiceElement.date)

                if (sameInvoice) {
                    res.status(400);
                    return res.send(`Веќе постои фактура на датум: ${sameInvoice.date} , со регистрација: ${sameInvoice.registrationNumber} и сопственик:  ${sameInvoice.owner}` );
                }
                else {
                    let invoice = new Invoice(invoiceElement);
                    invoice.save()
                }

            }
            res.status(201)
            return res.json(true);
        })
    }

    function getAll(req, res) {
        const query = {};
        if(req.query.registrationNumber) {
            query.registrationNumber = req.query.registrationNumber;
        }
        Invoice.find(query, (err, invoices) => {
            if(err) {
                return res.send(err);
            }
            return res.json(invoices);
        });
    }

    function getCarInfo(req, res) {
        const query = {};
        Invoice.find(query, 'owner invoiceDocumentType totalPrice registrationNumber date', (err, invoices) => {
            if(err) {
                return res.send(err);
            }
            let invoicesClone = JSON.parse(JSON.stringify(invoices))
           const uniq = invoicesClone.filter((element, index, array) => {
               element.invoiceDates = [];
               element.invoiceDates.push({
                   invoiceDocumentType: element.invoiceDocumentType,
                   totalPrice: element.totalPrice,
                   date: element.date,
                   id: element._id
               })
               let indexOfFirstElementWithSameRegistrationNumber = array.findIndex((t) => (
                   t.registrationNumber === element.registrationNumber
               ))
               let isTheSameElement = index === indexOfFirstElementWithSameRegistrationNumber;
               if(!isTheSameElement) {
                   invoicesClone[indexOfFirstElementWithSameRegistrationNumber].invoiceDates.push({
                       date: element.date,
                       invoiceDocumentType: element.invoiceDocumentType,
                       totalPrice: element.totalPrice,
                       id: element._id
                   })
                   return false;
               }
               return true
           })
            for(let invoiceIndex = 0; invoiceIndex< uniq.length; invoiceIndex++) {
                uniq[invoiceIndex].invoiceDates.sort((invoiceDate1,invoiceDate2) => {
                    return invoiceDate1.date.substring(6) < invoiceDate2.date.substring(6) ||
                    (invoiceDate1.date.substring(6) === invoiceDate2.date.substring(6) && invoiceDate1.date.substring(3) < invoiceDate2.date.substring(3)) ||
                    (invoiceDate1.date.substring(6) === invoiceDate2.date.substring(6) && invoiceDate1.date.substring(3) === invoiceDate2.date.substring(3) && invoiceDate1.date < invoiceDate2.date)
                        ? 1 : -1;
                })
            }

            return res.json(uniq);
        });
    }

    function getAllAutoPartsAndTheirDates(req, res) {
        const query = {};
        if(req.query.registrationNumber) {
            query.registrationNumber = req.query.registrationNumber;
        }
        Invoice.find(query, (err, invoices) => {
            if(err) {
                return res.send(err);
            }
            let autoPartsAndDates = [];
            invoices.forEach(invoice => {
                invoice.autoPartsFromStock.forEach(autoPart => {
                    autoPartsAndDates.push({
                        autoPart: autoPart,
                        date: invoice.date
                    })
                })
                invoice.autoPartsOutOfStock.forEach(autoPart => {
                    autoPartsAndDates.push({
                        autoPart: autoPart,
                        date: invoice.date
                    })
                })

            })
            autoPartsAndDates.sort((autoPartObj1,autoPartObj2) => {
                return autoPartObj1.date.substring(6) < autoPartObj2.date.substring(6) ||
                    (autoPartObj1.date.substring(6) === autoPartObj2.date.substring(6) && autoPartObj1.date.substring(3) < autoPartObj2.date.substring(3) ) ||
                    (autoPartObj1.date.substring(6) === autoPartObj2.date.substring(6) && autoPartObj1.date.substring(3) === autoPartObj2.date.substring(3) && autoPartObj1.date < autoPartObj2.date  )
                ? 1 : -1;
            })
            return res.json(autoPartsAndDates);
        });
    }

    return { post, postList, getAll, getCarInfo, getAllAutoPartsAndTheirDates };
}

module.exports = invoiceController;
