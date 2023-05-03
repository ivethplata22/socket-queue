const TicketControl = require("../models/ticket-control");
const ticketControl = new TicketControl();

const socketController = (socket) => {

    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id );
    });

    socket.emit('ultimo-ticket', ticketControl.ultimo);

    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente = ticketControl.siguiente();
        callback( siguiente );

        //TODO: Notificar nuevo ticket pendiente de asignar
    })

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if( !escritorio )
            return callback({ ok: false, msg: 'El escritorio es obligatorio' });

        const ticket = ticketControl.atenderTicket( escritorio );
        if( !ticket )
            return callback({ ok: false, msg: 'Ya no hay tickets pendientes' });
        
        return callback({ ok: true, ticket });
    });

}

module.exports = {
    socketController
}