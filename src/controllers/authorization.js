module.exports = (req, res) => {
    try {
        const verify_token = "Timbring";
        
        let mode = req.query["hub.mode"];
        let token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];
    
        if (mode && token) {
          if (mode === "subscribe" && token === verify_token) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).json({message:challenge});
          } 
        } else {
          console.log("No se logro establecer conexión");
          res.status(404).json({error: "No se logro establecer el webhook"});
        }
    
      } catch (error) {
        console.log(error);
        res.status(404).json({error: error.message});
      }
}