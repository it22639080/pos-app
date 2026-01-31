
const OrderSchema = require("../model/OrderSchema");
const CustomerSchema = require("../model/CustomerSchema");

const create=(req,resp)=>{
    const order = new OrderSchema({
        date:req.body.date,
        customerDetails:req.body.customerDetails,
        totalCost:req.body.totalCost,
        products:req.body.products
    });

    order.save().then(response=>{
        resp.status(201).json({'message':'order saved!'});
    }).catch(error=>{
        return resp.status(500).json(error);
    });
}
const findById=(req,resp)=>{
    OrderSchema.findOne({'_id':req.params.id}).then(selectedObj=>{
        if(selectedObj!=null){
            return  resp.status(200).json({'data':selectedObj});
        }
        return resp.status(404).json({'message':'Order not found!'});
    });
}
const update=async (req,resp)=>{
    const updateData = await OrderSchema.findOneAndUpdate({'_id':req.params.id},{
        $set:{
            date:req.body.date,
            customerDetails:req.body.customerDetails,
            totalCost:req.body.totalCost,
            products:req.body.products
        }
    },{new:true});

    if(updateData){
        return  resp.status(200).json({'message':'updated'});
    }else{
        return resp.status(500).json({'message':'internal server error'});
    }
}
const deleteById=async (req,resp)=>{
    const deleteData = await OrderSchema.findByIdAndDelete({'_id':req.params.id});

    if(deleteData){
        return  resp.status(204).json({'message':'deleted'});
    }else{
        return resp.status(500).json({'message':'internal server error'});
    }
}
const findAll=(req,resp)=>{
    try{
        const {searchText, page=1, size=10}=req.query;

        const pageNumber=parseInt(page);
        const pageSize=parseInt(size);

        const query ={};
        if(searchText){
            query.$text={$search:searchText}
        }

        const skip= (pageNumber-1) * pageSize;

        OrderSchema.find(query)
            .limit(pageSize)
            .skip(skip).then(data=>{
                return resp.status(200).json(data);
            });

    }catch (error){
        return resp.status(500).json({'message':'internal server error'});
    }
}

const findAllIncome=async (req,resp)=>{
    try{
        const result = await OrderSchema.aggregate([
            {$group:{
                _id:null,
                    totalCostSum:{$sum:'$totalCost'}
                }}
        ]);
        console.log(result);
        const totalCostSum= result.length>0?result[0].totalCostSum:0;
        resp.json({totalCostSum});
    }catch (error){
        return resp.status(500).json({'message':'internal server error'});
    }
}
const findAllCount=(req,resp)=>{
    try{
        OrderSchema.countDocuments().then(data=>{
            return resp.status(200).json(data);
        })

    }catch (error){
        return resp.status(500).json({'message':'internal server error'});
    }
}

module.exports={
    create,findById,update,deleteById,findAll,findAllCount,findAllIncome
}