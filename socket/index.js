module.exports = async (io) => {
  io.on("connection",async(socket) => {
    console.log(`socket is connected -------> `, socket)
  });
};