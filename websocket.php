<?php
include 'db_head.php'; // Include your XAMPP database connection

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
require 'vendor/autoload.php';

class VendorServer implements MessageComponentInterface {
    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection: ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        global $conn;  // Use XAMPP MySQL connection

        $data = json_decode($msg, true);
        $vid = mysqli_real_escape_string($conn, $data['vid']);

        $sql = "SELECT * FROM vendor WHERE vid = '$vid'";
        $result = $conn->query($sql);

        $rows = [];
        if ($result->num_rows > 0) {
            while ($r = mysqli_fetch_assoc($result)) {
                $rows[] = $r;
            }
        }

        $from->send(json_encode($rows));
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} closed\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
        $conn->close();
    }
}

// Start WebSocket Server
$server = \Ratchet\Server\IoServer::factory(
    new \Ratchet\Http\HttpServer(
        new \Ratchet\WebSocket\WsServer(
            new VendorServer()
        )
    ),
    8080  // Run on port 8080
);

$server->run();
?>
