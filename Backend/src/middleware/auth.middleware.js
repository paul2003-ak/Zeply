export const protectRoute=async(req,res,next)=>{
    try {
        if(!req.auth().isAuthenticated){
            return res.status(401).json({message:"Unauthorized"});
        }
        next();
    } catch (error) {
        res.status(500).json({message:"Server Error",error:error.message});
    }
};
//the auth is controlable by clerk package