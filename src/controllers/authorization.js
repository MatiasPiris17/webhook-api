module.exports = (req, res) => {
    try {
        const verify_token = "Timbring";
        
        let mode = req.query["hub.mode"];
        let token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];
    
        if (mode && token) {
          if (mode === "subscribe" && token === verify_token) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
          } 
        } else {
          console.log("Conectado pero no verificado");
          res.status(200)
        }
    
      } catch (error) {
        console.log(error);
        res.status(404).json({error: error.message});
      }
}