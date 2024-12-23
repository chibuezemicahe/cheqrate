const getExchangeRate = ()=>{
    return [
        { platform: 'Platform A', rate: 700 },
        { platform: 'Platform B', rate: 750 },
        { platform: 'Platform C', rate: 680 },
    ]
}


const fetchExchangeRate = (req,res,next)=>{
    try{
        const rates = getExchangeRate();
        if(rates){
        res.json({ssuccess: true, data: rates});
        }
    } catch(error){

        res.status(500).json({success: false, message: 'Failed to fetch exchange rates'});
    }

}

module.exports = {
    fetchExchangeRate,
  };