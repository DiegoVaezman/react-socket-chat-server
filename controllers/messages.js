const Message = require("../models/message");

const getChat = async (req, res) => {
  const myId = req.uid;
  const messagesFrom = req.params.from;

  try {
    const last30 = await Message.find({
      $or: [
        {
          from: myId,
          to: messagesFrom,
        },
        {
          from: messagesFrom,
          to: myId,
        },
      ],
    })
      .sort({ createdAt: "asc" })
      .limit(30);

    res.status(200).json({
      ok: true,
      messages: last30,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Contacte con el administrador",
    });
  }
};

module.exports = {
  getChat,
};
