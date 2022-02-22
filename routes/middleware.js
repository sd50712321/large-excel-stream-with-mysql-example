exports.isLoggedIn = (req,res,next) => {
    // console.log('isloggedIn',req)
    // res.locals.user = req.session.passport.user
    if(req.session.user){
        next()
    }else{
        res.send('<script>alert("로그인이 필요합니다"); window.location.href="/";</script>');
    }
}

exports.isNotLoggedIn = (req,res,next)=>{
    console.log('session not logged',req.session.user)
    if(!req.session.user){
        next()
    }else{
        res.redirect('/home/main')
    }
}
