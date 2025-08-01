<?php
namespace App\Core;
use App\Core\JWTHandler;
abstract class AbstractController{
  // ?دي قائمة بالـ headers اللي هتتبعت في كل request.
  protected array $headers = [
    'content-Type: application/json; charset=utf-8', //? بيقول إن الرد هيكون JSON
    'Access-Control-Allow-Origin: *', //? بيخلي أي موقع (زي React) يقدر يتصل
    'Access-Control-Allow-Methods: GET, POST, PUT,DELETE ,OPTIONS', //? بيحدد أنواع الطلبات المسموحة
    'Access-Control-Allow-Headers: Content-Type, Authorization' //? لو بتبعت توكن أو محتوى خاص
  ];
  public function __construct(){
    $this->setHeaders();
  }
//   أول ما أي كنترولر يتبني 
// هينفذ أوتوماتيكًا دالة 
// setHeaders()
//  ويضيف الهيدر في بداية كل رد.
  public function setHeaders(){
    foreach ($this->headers as $header) {
      header($header);
    }
  }
  // دي أهم دالة، هي اللي بترجع رد React محتاجه.
  protected function json($data , int $code = 200){
    http_response_code($code);
    echo json_encode($data);
  }
  // دي بتسهل ارسال الاخطاء
  protected function sendError(string $message , int $code = 400){
    $this->json([
      'status'=>'error',
      'message' => $message
    ],$code);
  }


  protected function getUserFromToken(){
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $this->sendError("Unauthorized", 401);
        exit;
    }

    $jwt = new JWTHandler();
    $decoded = $jwt->verifyToken($matches[1]);

    if (!$decoded) {
        $this->sendError("Invalid token", 401);
        exit;
    }

    return (array) $decoded; // تقدر تاخد منها الـ id مثلاً
  }

}
?>