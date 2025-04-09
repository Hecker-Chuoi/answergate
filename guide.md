# Hướng dẫn sử dụng: Answergate

- [Hướng dẫn sử dụng: Answergate](#hướng-dẫn-sử-dụng-answergate)
  - [About project](#about-project)
  - [Tính năng chính](#tính-năng-chính)
  - [Luồng sử dụng](#luồng-sử-dụng)
    - [ADMIN](#admin)
    - [USER](#user)

## About project
Đây là hệ thống thi trắc nghiệm trực tuyến, hỗ trợ ra đề thi, phân chia ca thi và chấm điểm tự động và lưu trữ lịch sử làm bài.

Các công nghệ, kiến thức sử dụng:
* **Backend**: framework java Springboot
* **Frontend**: ReactJS, Vite, TypeScript
* **Database**: SQL Server

## Tính năng chính
Vai trò **USER**:
* Xem danh sách các ca thi được giao
* Vào làm bài thi khi đến thời gian
* Cập nhật bài làm, nộp bài

Vai trò **ADMIN**:
* **Quản lý danh sách user**
  * Xem danh sách user hiện tại
  * Thêm từng user
  * Nhập nhiều user bằng file excel
  * Sửa thông tin user
  * Xóa user
* **Quản lý test**
  * Xem danh sách test
  * Xem thông tin chi tiết: tên test, môn học, danh sách câu hỏi
  * Tạo test mới
  * Chỉnh sửa thông tin bài test
  * Chỉnh sửa danh sách câu hỏi
  * Xóa test
* **Quản lý ca thi**
  * Xem danh sách ca thi
  * Xem thông tin chi tiết: đề thi sử dụng, danh sách thí sinh, danh sách kết quả thi (cập nhật liên tục trong thời gian làm bài)
  * Tạo ca thi mới
  * Chỉnh sửa thông tin ca thi: thời gian bắt đầu, thời gian làm bài, bài test sử dụng, danh sách thí sinh
  * Xóa ca thi

## Luồng sử dụng
### ADMIN
* **Bước 1**: Quản trị viên đăng nhập với vai trò admin, với thông tin đăng nhập mặc định
  * **Username**: admin
  * **Password**: admin
![alt text](public/adminLogin.png)
![alt text](public/adminHome.png)
  
* **Bước 2**: Quản lý danh sách user
  * Xem danh sách
  ![alt text](public/image.png)
  * Xem thông tin chi tiết của user: click vào **Chi tiết** ở cuối mỗi hàng
  ![alt text](public/image-1.png)
  * Chỉnh sửa thông tin user: trong màn hình xem chi tiết, bấm **Chỉnh sửa**
  ![alt text](public/image-2.png)
  * Thêm user mới: click vào button **Thêm người dùng**, nhập đầy đủ thông tin và bấm **Tạo người dùng**
    ![alt text](public/image-4.png)
  * Nhập danh sách user từ file excel
    * File excel phải đúng format, nếu có một dòng lỗi thì sẽ không nhập user nào từ file
        ![alt text](public/image-5.png)
    * Bấm vào nút **Tải lên**, sau đó chọn file excel có định dạng đúng như trên
        ![alt text](public/image-6.png)
  * Xóa user: click vào ô tròn trước mỗi hàng và bấm **Xóa**
    ![alt text](public/image-7.png)

* **Bước 3**: Quản lý danh sách test: 
  * **Xem danh sách đề thi**: vào admin-home -> quản lý đề thi
    ![alt text](public/image-8.png)
  * **Tạo đề thi mới**: click vào **tạo đề thi mới**, nhập thông tin và bấm **Lưu**
    ![alt text](public/image-11.png)
  * **Xem chi tiết đề thi**: click vào chi tiết ở cột **Thao tác**
    ![alt text](public/image-9.png)
    ![alt text](public/image-10.png)
  * Chỉnh sửa đề thi: trong màn hình **Xem chi tiết**, chọn **Chỉnh sửa**
    * Chỉnh sửa thông tin bài thi: ở trong tab *Thông tin chung*, nhập thông tin các trường
        ![alt text](public/image-12.png)
    * Chỉnh sửa danh sách câu hỏi: ở trong tab *Câu hỏi*
      * Thêm câu hỏi:
        ![alt text](public/image-15.png)
      * Chỉnh sửa câu hỏi:
        ![alt text](public/image-14.png)
      * Xóa câu hỏi:
        ![alt text](public/image-17.png)
      Sau khi chỉnh sửa xong tất cả thì bấm vào **Lưu thay đổi**

* **Bước 4**: Quản lý phiên thi
  * Xem danh sách phiên thi
    ![alt text](public/image-18.png)
  * Xem thông tin chi tiết: bấm vào **Chi tiết** ở cột **Thao tác**
    * Thông tin chung
        ![alt text](public/image-19.png)
    * Danh sách thí sinh
        ![alt text](public/image-20.png)
    * Kết quả: danh sách thể hiện tình trạng làm bài của tất cả các thí sinh
        ![alt text](public/image-21.png)
  * Chỉnh sửa phiên thi: bấm vào chỉnh sửa
    ![alt text](public/image-22.png)
    Nhập các thông tin và bấm **Cập nhật**
    ![alt text](public/image-23.png)
  * Chỉnh sửa đề thi:
    ![alt text](public/image-24.png)
    Danh sách đề thi hiện lên, bấm **Chọn** vào đề thi muốn sử dụng
        ![alt text](public/image-25.png)
  * Chỉnh sửa danh sách thí sinh
    * Vào tab **Thí sinh**, chọn **Thêm thí sinh**. Lúc này có 2 option: Thêm thí sinh theo loại hoặc thêm thủ công
      * Thêm thí sinh theo loại: chọn tất cả các loại mong muốn và bấm **Thêm thí sinh**
        ![alt text](public/image-26.png)
      * Thêm thí sinh tùy chỉnh: nhập danh sách username của các thí sinh và bấm **Thêm thí sinh**
        ![alt text](public/image-27.png)

### USER
* **Bước 1**: Đăng nhập
  * Username: các ký tự đầu trong họ tên + mã số ngẫu nhiên (do ADMIN cung cấp)
  * Password: ngày tháng năm sinh ở định dạng ddMMyyyy
  Ví dụ: username: nht551, password: 19102004 (sinh ngày 19/10/2004)

* **Bước 2**: Xem danh sách bài thi
  ![alt text](public/image-28.png)

* **Bước 3**: Làm bài thi
  * Click chọn **Vào làm bài**
    ![alt text](public/image-29.png)
  * Vào test-confirmation, chọn **Bắt đầu làm bài**
    ![alt text](public/image-30.png)
  * Xem trạng thái làm bài:
    ![alt text](public/image-31.png)
  * Đánh dấu: mark for review
    ![alt text](public/image-32.png)
  * Trả lời câu hỏi
    ![alt text](public/image-33.png)
  * Lưu tiến trình làm bài: rất quan trọng nếu không muốn bị mất tiến trình do các yếu tố không mong muốn (mất mạng, mất điện)
    ![alt text](public/image-35.png)
  * Nộp bài: nếu không nộp bài thì sau khi hết thời gian hệ thống sẽ tự động nộp