const Invoice = require("../models/invoice")

exports.getInvoiceById = (req,res,next,id)=>{
    Invoice.findById(id)
    .populate('babyId bookingId')
    .exec((err,invoice)=>{
        if(err || !invoice){
            return res.status(400).json({
                error: "Unable to find invoice"
            })
        }
        req.invoice = invoice;
        next();
    })
}

exports.getBookingInvoice = (req,res) => {
    Invoice.find({'bookingId': req.params.bookingId})
    .populate("babyId bookingId").exec( (err, invoices) => {
        if(err || !invoices){
            return res.status(400).json({
                error: "Unable to find invoice"
            })
        }
        return res.json({
            invoices: invoices
        })
    })
}
exports.getAllInvoices = (req,res) => {
    Invoice.find()
    .populate("babyId bookingId parent").exec( (err, invoices) => {
        if(err || !invoices){
            return res.status(400).json({
                error: "Unable to find invoice"
            })
        }
        return res.json({
            invoices: invoices
        })
    })
}

exports.addInvoice = (req,res,next)=>{
    const invoice = new Invoice({
        parent: req.body.parent,
        babyId: req.body.babyId,
        bookingId: req.params.bookingId,
        invoiceAmount: req.body.invoiceAmount
    });
    invoice.save((err,invoice)=>{
        if(err){
            return res.status(400).json({
                error: "Cannot save the invoice"
            })
        }
        res.locals.invoice = invoice
        console.log("Done in Invoice")
        // push payment in booking             
        next()       
    })
}

