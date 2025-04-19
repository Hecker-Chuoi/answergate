<a id="readme-top"></a>

# Trang web thi trắc nghiệm dành cho quân đội

<!-- TABLE OF CONTENTS -->
- [Trang web thi trắc nghiệm dành cho quân đội](#trang-web-thi-trắc-nghiệm-dành-cho-quân-đội)
  - [1. Giới thiệu dự án](#1-giới-thiệu-dự-án)
    - [1.1. Mục đích](#11-mục-đích)
    - [1.2. Cấu trúc dự án](#12-cấu-trúc-dự-án)
  - [2. Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
    - [2.1. Backend](#21-backend)
      - [Ngôn ngữ lập trình Java](#ngôn-ngữ-lập-trình-java)
      - [Framework Spring boot](#framework-spring-boot)
    - [2.2. Frontend](#22-frontend)
      - [Ngôn ngữ lập trình JavaScript](#ngôn-ngữ-lập-trình-javascript)
      - [Framework ReactJs](#framework-reactjs)
    - [2.3. Hệ quản trị cơ sở dữ liệu SQL Server](#23-hệ-quản-trị-cơ-sở-dữ-liệu-sql-server)
  - [3. Triển khai dự án](#3-triển-khai-dự-án)
    - [3.1. Giai đoạn 1: phân tích yêu cầu, thiết kế cơ sở dữ liệu (database)](#31-giai-đoạn-1-phân-tích-yêu-cầu-thiết-kế-cơ-sở-dữ-liệu-database)
      - [Sơ đồ thực thể - quan hệ (Entity-Relationship diagram)](#sơ-đồ-thực-thể---quan-hệ-entity-relationship-diagram)
      - [Sơ đồ cơ sở dữ liệu](#sơ-đồ-cơ-sở-dữ-liệu)
    - [3.2. Giai đoạn 2: phát triển BACKEND sử dụng ngôn ngữ lập trình Java và framework Spring boot](#32-giai-đoạn-2-phát-triển-backend-sử-dụng-ngôn-ngữ-lập-trình-java-và-framework-spring-boot)
      - [Bước 1: Khởi tạo dự án](#bước-1-khởi-tạo-dự-án)
      - [Bước 2: Tạo các đối tượng (entity)](#bước-2-tạo-các-đối-tượng-entity)
      - [Bước 3: Triển khai service](#bước-3-triển-khai-service)
      - [Bước 4: Triển khai controller](#bước-4-triển-khai-controller)
    - [4.3. Giai đoạn 3: phát triển FRONTEND sử dụng ngôn ngữ lập trình JavaScript và framework ReactJs](#43-giai-đoạn-3-phát-triển-frontend-sử-dụng-ngôn-ngữ-lập-trình-javascript-và-framework-reactjs)
      - [Bước 1: Tạo các component](#bước-1-tạo-các-component)
      - [Bước 2: Triển khai giao diện](#bước-2-triển-khai-giao-diện)
      - [Bước 3: Liên kết với BACKEND](#bước-3-liên-kết-với-backend)
  - [4. Hướng dẫn cài đặt](#4-hướng-dẫn-cài-đặt)
    - [2.1. Yêu cầu phần cứng](#21-yêu-cầu-phần-cứng)
    - [4.2. Yêu cầu phần mềm](#42-yêu-cầu-phần-mềm)
    - [4.3. Cài đặt](#43-cài-đặt)
      - [Bước 1: Tải các phần mềm cần thiết và thiết lập hệ thống](#bước-1-tải-các-phần-mềm-cần-thiết-và-thiết-lập-hệ-thống)
      - [Bước 2: Sau khi cài đặt xong SQL Server, cần phải cấu hình cho database để BackEnd có thể kết nối](#bước-2-sau-khi-cài-đặt-xong-sql-server-cần-phải-cấu-hình-cho-database-để-backend-có-thể-kết-nối)
      - [Bước 3: Tải về source code của hệ thống, tạo package backend](#bước-3-tải-về-source-code-của-hệ-thống-tạo-package-backend)
      - [Bước 4: Sửa thông tin địa chủ máy chủ trong FrontEnd](#bước-4-sửa-thông-tin-địa-chủ-máy-chủ-trong-frontend)
      - [Bước 5: Mở ứng dụng](#bước-5-mở-ứng-dụng)

<!-- ABOUT THE PROJECT -->
## 1. Giới thiệu dự án
Đây là dự án fullstack sử dụng Spring boot và ReactJS cùng với hệ quản trị cơ sở dữ liệu SQL Server.

### 1.1. Mục đích
Cung cấp môi trường thi trắc nghiệm dành cho đối tượng đặc biệt là quân đội. Giúp cho việc tổ chức kỳ thi, đánh giá năng lực quân nhân dễ dàng và lưu trữ kết quả thi lâu dài.

### 1.2. Cấu trúc dự án

## 2. Công nghệ sử dụng
### 2.1. Backend
#### Ngôn ngữ lập trình Java
![alt text](/public/readme%20images/image-3.png)
Java là một trong những ngôn ngữ lập trình hướng đối tượng. Ngôn ngữ Java được sử dụng phổ biến trong phát triển phần mềm, trang web, game hay ứng dụng trên các thiết bị di động.

Java được khởi đầu bởi James Gosling và bạn đồng nghiệp ở Sun MicroSystem năm 1991. Ban đầu Java được tạo ra nhằm mục đích viết phần mềm cho các sản phẩm gia dụng, và có tên là Oak. Java được chính thức phát hành năm 1994, đến năm 2010 được Oracle mua lại từ Sun MicroSystem.

> Java được thiết kế với tiêu chí **“Write Once, Run Anywhere”** (viết một lần, chạy mọi nơi), tức là mã nguồn Java sau khi biên dịch có thể chạy trên bất kỳ nền tảng nào hỗ trợ Java Virtual Machine (JVM), mà không cần thay đổi lại mã. Điều này giúp Java trở thành một ngôn ngữ lập trình đa nền tảng và rất phổ biến.

#### Framework Spring boot
![alt text](/public/readme%20images/image-5.png)
Spring Boot là một trong số các module của Spring framework chuyên cung cấp các tính năng RAD (Rapid Application Development) cho phép tạo ra và phát triển các ứng dụng độc lập dựa trên Spring một cách nhanh chóng.

Spring Boot ra đời với mục đích loại bỏ những cấu hình phức tạp của Spring, nó không yêu cầu cấu hình XML và nâng cao năng suất cho các nhà phát triển. Với sự góp mặt của Spring Boot, hệ sinh thái Spring đã trở nên mạnh mẽ, phổ biến và hiệu quả hơn bao giờ hết.

Ưu điểm của Spring boot:
* Hội tụ đầy đủ các tính năng của Spring framework.
* Đơn giản hóa cấu hình và xây dựng được các ứng dụng độc lập có khả năng chạy bằng “java -jar” nhờ các dependency starter.
* Dễ dàng deploy vì các ứng dụng server được nhúng trực tiếp vào ứng dụng để tránh những khó khăn khi triển khai lên môi trường production mà không cần thiết phải tải file WAR.
* Cấu hình ít, tự động hỗ trợ bất cứ lúc nào cho chức năng giống với Sping như tăng năng suất, giảm thời gian viết code và không yêu cầu XML config.
* Cung cấp nhiều plugin, số liệu, cấu hình ứng dụng từ bên ngoài.

### 2.2. Frontend
#### Ngôn ngữ lập trình JavaScript
![alt text](/public/readme%20images/image-2.png)
JavaScript viết tắt là JS à ngôn ngữ lập trình phổ biến dùng để tạo ra các trang web tương tác. Được tích hợp và nhúng vào HTML giúp website trở nên sống động hơn. JavaScript đóng vai trò như một phần của trang web, thực thi cho phép Client-Side Script từ phía người dùng cũng như phía máy chủ (Nodejs) tạo ra các trang web động.

JavaScript là một ngôn ngữ lập trình thông dịch với khả năng hướng đến đối tượng. Là một trong 3 ngôn ngữ chính trong lập trình web và có mối liên hệ lẫn nhau để xây dựng một website sống động, chuyên nghiệp, bạn có thể nhìn tổng quan như sau:
* HTML: Cung cấp cấu trúc cơ bản, hỗ trợ trong việc xây dựng layout, thêm nội dung dễ dàng trên website.
* CSS: Được sử dụng để kiểm soát và hỗ trợ việc định dạng thiết kế, bố cục, style, màu sắc,…
* JavaScript: Tạo nên những nội dung “động” trên website.

#### Framework ReactJs
![alt text](/public/readme%20images/image-1.png)
React (ReactJS) là một thư viện JavaScript mã nguồn mở, được dùng để xây dựng giao diện người dùng (frontend) cho web. React chỉ tập trung vào phần hiển thị giao diện (view), chứ không can thiệp vào cách sắp xếp logic nghiệp vụ hoặc cấu trúc ứng dụng.

### 2.3. Hệ quản trị cơ sở dữ liệu SQL Server
![alt text](/public/readme%20images/image.png)
SQL Server hay Microsoft SQL Server là một hệ thống quản trị cơ sở dữ liệu quan hệ (Relational Database Management System – RDBMS) được phát triển bởi Microsoft vào năm 1988. Nó được sử dụng để tạo, duy trì, quản lý và triển khai hệ thống RDBMS. 

Được thiết kế để quản lý và lưu trữ dữ liệu, SQL Server cho phép người dùng truy vấn, thao tác và quản lý dữ liệu một cách hiệu quả và an toàn. SQL Server là một trong những hệ quản trị cơ sở dữ liệu phổ biến nhất trên thế giới và được sử dụng rộng rãi trong các doanh nghiệp.

SQL Server được sử dụng để tạo và duy trì các cơ sở dữ liệu quan hệ, cung cấp nền tảng vững chắc cho việc lưu trữ và quản lý dữ liệu. Các chức năng chính bao gồm:
* **Quản lý dữ liệu**: SQL Server cho phép người dùng tạo, sửa đổi và xóa các bảng dữ liệu, chỉ mục, và các mối quan hệ giữa các bảng. Hệ thống quản lý dữ liệu của SQL Server hỗ trợ các thao tác CRUD (Create, Read, Update, Delete), giúp quản lý dữ liệu một cách hiệu quả.
* **Bảo mật dữ liệu**: SQL Server cung cấp các tính năng bảo mật mạnh mẽ như mã hóa dữ liệu, kiểm soát truy cập dựa trên vai trò và xác thực người dùng. Các biện pháp bảo mật này đảm bảo rằng dữ liệu được bảo vệ khỏi các mối đe dọa và truy cập trái phép.
* **Quản lý giao dịch**: SQL Server hỗ trợ các tính năng quản lý giao dịch như Atomicity, Consistency, Isolation và Durability (ACID), đảm bảo rằng các thay đổi trong cơ sở dữ liệu được thực hiện một cách nhất quán và an toàn. Điều này rất quan trọng đối với các ứng dụng yêu cầu độ tin cậy cao như tài chính, ngân hàng và thương mại điện tử.
* **Sao lưu và phục hồi**: SQL Server cung cấp các tính năng sao lưu và phục hồi dữ liệu, cho phép người dùng tạo các bản sao lưu toàn bộ, gia tăng và khác biệt. Các tính năng này giúp bảo vệ dữ liệu khỏi mất mát do lỗi phần cứng, phần mềm hoặc lỗi con người và đảm bảo rằng dữ liệu có thể được phục hồi nhanh chóng trong trường hợp xảy ra sự cố.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 3. Triển khai dự án
### 3.1. Giai đoạn 1: phân tích yêu cầu, thiết kế cơ sở dữ liệu (database)
Trang web được thiết kế dành cho 2 đối tượng sử dụng:
* **CANDIDATE**: dành cho quân nhân (bao gồm cả 3 đối tượng *chiến sĩ, sĩ quan, chuyên nghiệp*), có thể đăng nhập vào hệ thống bằng tài khoản, mật khẩu được cấp, làm bài thi được giao
* **ADMIN**: dành cho quản trị viên, có thể quản lý *USER*, quản lý các bài kiểm tra (*test*), quản lý các ca thi (*test session*)

Các đối tượng:
* **USER**: chứa thông tin đăng nhập của người sử dụng hệ thống, đối tượng này lưu trữ:
  * *Thông tin tài khoản*: chứa tên đăng nhập và mật khẩu
  * *Thông tin cá nhân của người sử dụng*: họ tên, ngày sinh, giới tính, quê quán
  * *Vai trò và quyền (role)*: CANDIDATE hoặc ADMIN
  * *Loại quân nhân (type)*: SOLDIER, OFFICER hoặc PROFESSIONAL tương ứng với các loại quân nhân chiến sĩ, sĩ quan hoặc chuyên nghiệp
  
* **Test**: là đối tượng lưu trữ các thông tin của một bài kiểm tra bao gồm
  * *testName*: tên bài kiểm tra
  * *subject*: chủ đề bài kiểm tra
  * *editedTime*: thời gian sửa đổi lần cuối
  
* **Question**: mỗi question lưu trữ các thông tin của một câu hỏi trong đề thi
  * *questionText*: nội dung câu hỏi
  * *explainText*: đáp án + giải thích câu trả lời
  * *questionType*: SINGLE_CHOICE/MULTIPLE_CHOICE tương ứng với câu hỏi có 1 hoặc nhiều lựa chọn
  * *belongToTest*: mỗi câu hỏi cần thuộc về một bài kiểm tra, trường này lưu trữ id bài kiểm tra của câu hỏi (phục vụ khi truy vấn câu hỏi của mỗi bài kiểm tra)
  
* **Answer**: chứa mỗi lựa chọn của từng question
  * *answerText*: nội dung lựa chọn
  * *isCorrect*: true/ false đánh dấu lựa chọn có đúng hay không
  * *questionId*: chứa id của question tương ứng

* **TestSession**: chứa thông tin ca thi
  * *startTime*: thời gian bắt đầu
  * *timeLimit*: giới hạn thời lượng làm bài
  * *testId*: id của bài test được sử dụng trong ca thi
  
* **SessionCandidateAssign**: chứa danh sách thí sinh của từng ca thi

* **TestResult**: lưu trữ kết quả thi của mỗi thí sinh
  
* **TestAnswer**: lưu trữ lựa chọn của mỗi thí sinh cho từng câu hỏi trong bài thi

#### Sơ đồ thực thể - quan hệ (Entity-Relationship diagram)
Sử dụng cho quá trình phân tích yêu cầu và làm rõ mối quan hệ giữa các thực thể.

![alt text](/public/readme%20images/image-7.png)

#### Sơ đồ cơ sở dữ liệu
Sơ đồ chi tiết các bảng trong cơ sở dữ liệu cùng với kiểu dữ liệu của từng trường và mối quan hệ giữa các bảng.

![alt text](/public/readme%20images/image-6.png)

### 3.2. Giai đoạn 2: phát triển BACKEND sử dụng ngôn ngữ lập trình Java và framework Spring boot
#### Bước 1: Khởi tạo dự án
1. Tạo project và import vào IDE
   ![alt text](/public/readme%20images/image-8.png)
2. Thêm cấu hình
   ```yaml
    server:
      port: 8080
      servlet:
        context-path: /exam

    spring:
      application:
        name: multiple-choice exam
      jpa:
        hibernate:
          ddl-auto: update
    #    show-sql: true
        properties:
          hibernate:
    #        format_sql: true
            use_nationalized_character_data: true
            dialect: org.hibernate.dialect.SQLServerDialect
      datasource:
        url: jdbc:sqlserver://localhost:1433;database=multiple_choice_exam;trustServerCertificate=True;
        username: sa
        password: root

    springdoc:
      info:
        title: Multiple Choice Exam
        description: Multiple Choice Exam
        version: 1.0.0
      api-docs:
        groups:
          enabled: true
      swagger-ui:
        groups-order: asc
        operations-sorter: order
      writer-with-order-by-keys: true

    jwt:
      secret-key: "2V1jD5V4U7JOAO0XavZU90W2MNaVfcRrdwEzdFejWfvMAFi5dMGoE5CEJAAY9onL"
   ```
3. Thêm các dependencies cần thiết
  ```xml
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>

  <dependency>
    <groupId>com.microsoft.sqlserver</groupId>
    <artifactId>mssql-jdbc</artifactId>
    <version>12.8.1.jre11</version>
  </dependency>

  <dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>10.7.1</version>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>

  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>

  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok-mapstruct-binding</artifactId>
    <version>0.2.0</version>
  </dependency>

  <dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.6.3</version>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>

  <dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi</artifactId>
    <version>5.4.0</version>
  </dependency>

  <dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.4.0</version>
  </dependency>

  <dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.18.0</version>
  </dependency>

  <dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
    <version>6.4.3</version>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
    <version>3.4.3</version>
  </dependency>

  <dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.8.6</version>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  ```

#### Bước 2: Tạo các đối tượng (entity)
![alt text](/public/readme%20images/image-9.png)

Ví dụ entity User:
```java
package com.hecker.exam.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.hecker.exam.entity.enums.Gender;
import com.hecker.exam.entity.enums.Role;
import com.hecker.exam.entity.enums.Type;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class User {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    long userId;
    @Column(unique = true)
    String username;
    String password;
    String fullName;
    LocalDate dob;
    @Enumerated(EnumType.STRING)
    Gender gender;
    String phoneNumber;
    String mail;
    @Enumerated(EnumType.STRING)
    Type type;
    String hometown;
    @Enumerated(EnumType.STRING)
    Role role;
    @Builder.Default
    Boolean isDeleted = false;

    @OneToMany(mappedBy = "candidate", fetch = FetchType.LAZY, orphanRemoval = true, cascade = CascadeType.ALL)
    @ToString.Exclude
    @JsonIgnore
    List<CandidateResult> takenTests;

    @ManyToMany(mappedBy = "candidates", fetch = FetchType.LAZY)
    @ToString.Exclude
    @JsonIgnore
    @OrderBy("startTime ASC")
    List<TestSession> assignedSessions;
}
```

Xem chi tiết ở: `Backend/src/main/java/com/hecker/exam/entity`.

#### Bước 3: Triển khai service
Service là nơi chứa các phương thức triển khai cụ thể từng yêu cầu trong hệ thống.

Ví dụ: AuthService là nơi chứa tất cả các code dùng để xác thực người dùng
```java
public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
    JWSVerifier verifier = new MACVerifier(secretKey.getBytes());

    SignedJWT jwt = SignedJWT.parse(request.getToken());
    JWTClaimsSet claimsSet = jwt.getJWTClaimsSet();

    boolean isExpired = claimsSet.getExpirationTime().before(new Date());

    return IntrospectResponse.builder()
            .valid(jwt.verify(verifier) && !isExpired)
            .build();
}

public AuthenticationResponse getToken(AuthenticationRequest request) {
    User user = repos.findByUsername(request.getUsername()).orElseThrow(
            () -> new AppException(StatusCode.USER_NOT_FOUND)
    );

    if(!encoder.matches(request.getPassword(), user.getPassword()))
        throw new AppException(StatusCode.UNAUTHENTICATED);

    return AuthenticationResponse.builder()
            .authenticated(true)
            .token(generateToken(user))
            .build();
}
```

Các service trong hệ thống bao gồm:
* **AuthService**: xử lý xác thực người dùng
* **UserService**: xử lý các tác vụ liên quan đến quản lý, thêm/sửa/xóa hoặc lấy danh sách người dùng
* **TestService**: xử lý các tác vụ liên quan đến các bài kiểm tra như thêm/sửa/xóa thông tin bài kiểm tra, xem/chỉnh sửa danh sách câu hỏi.
* **SessionService**: xử lý các tác vụ liên quan đến ca thi như thay đổi thời gian bắt đầu/thời lượng làm bài, danh sách thí sinh.
* **TakingTestService**: xử lý các tác vụ liên quan đến thực hiện bài kiểm tra, bao gồm: lấy danh sách các bài kiểm tra sắp diễn ra, bắt đầu bài kiểm tra, lưu tiến trình làm bài, nộp bài thi.
  
![alt text](/public/readme%20images/image-10.png)

Xem chi tiết ở: `Backend/src/main/java/com/hecker/exam/service`.

#### Bước 4: Triển khai controller
Controller là thành phần điều khiển, định nghĩa cách một chức năng được gọi đến và giá trị trả về.

![alt text](/public/readme%20images/image-11.png)

Xem chi tiết ở: `Backend/src/main/java/com/hecker/exam/controller`.

### 4.3. Giai đoạn 3: phát triển FRONTEND sử dụng ngôn ngữ lập trình JavaScript và framework ReactJs
#### Bước 1: Tạo các component
Component là một đối tượng JavaScript được sử dụng để tạo các thành phần giao diện người dùng. Nó giúp tách một ứng dụng thành các phần nhỏ hơn, dễ quản lý và tái sử dụng.

Các component được tạo ra để giúp tách một ứng dụng thành các phần nhỏ hơn, dễ quản lý và tái sử dụng. Chúng có thể được sử dụng để tạo các phần tử UI như nút, trình đơn, biểu đồ, form, bảng, v.v.

![alt text](/public/readme%20images/image-12.png)

Ví dụ như hình trên ta có thể chia một trang web thành các component nhỏ hơn và các component này tổ chức theo cấu trúc dạng cây. Ta có thể tái sử dụng các components này ở các page khác nhau nếu cần.

Mỗi trang web có thể chứa rất nhiều component tùy thuộc vào kích thước hệ thống, để xem chi tiết các component của hệ thống, vào: `Frontend/src/components`.

#### Bước 2: Triển khai giao diện
Giao diện web chính là giao diện người dùng của một trang web. Nó bao gồm tất cả các yếu tố mà người dùng nhìn thấy và tương tác khi truy cập vào một trang web cụ thể. Giao diện trang web không chỉ đơn thuần là bố cục và thiết kế website, mà còn liên quan đến trải nghiệm người dùng, sự tương tác và thẩm mỹ.

Các giao diện chính của hệ thống:
* Trang đăng nhập
  ![alt text](/public/readme%20images/image-13.png)
* Trang chủ của thí sinh
  ![alt text](/public/readme%20images/image-18.png)
* Trang chờ + xác nhận bắt đầu làm bài
  ![alt text](/public/readme%20images/image-19.png)
* Trang làm bài thi
  ![alt text](/public/readme%20images/image-20.png)
* Trang chủ của quản trị viên
  ![alt text](/public/readme%20images/image-14.png)
* Trang quản lý người dùng
  ![alt text](/public/readme%20images/image-15.png)
* Trang quản lý bài kiểm tra
  ![alt text](/public/readme%20images/image-16.png)
* Trang quản lý ca thi
  ![alt text](/public/readme%20images/image-17.png)

#### Bước 3: Liên kết với BACKEND
Một trang web quan trọng nhất là có thể quản lý dữ liệu của người dùng, đó là lý do chúng ta cần đến BACKEND để xử lý logic và lưu dữ liệu vào cơ sở dữ liệu để lưu trữ lâu dài.

![alt text](/public/readme%20images/image-21.png)

Ví dụ: authService đảm nhiệm việc gửi yêu cầu xác thực sang BE và ánh xạ kết quả trả về vào các đối tượng để triển khai về sau:

```tsx
import { config } from '@/config';

// Standardized API Response type matching backend structure
type ApiResponse<T> = {
  statusCode: number;
  message: string;
  result: T;
};

type AuthResult = {
  authenticated: boolean;
  token: string;
};

type TokenValidationResult = {
  valid: boolean;
};

type UserInfo = {
  userId?: number;
  username: string;
  fullName: string;
  dob?: string;
  gender?: string;
  phoneNumber?: string;
  mail?: string;
  hometown?: string;
  role: 'USER' | 'ADMIN';
  type?: string;
};

const API_URL = config.apiUrl;

export const authService = {
  login: async (username: string, password: string): Promise<ApiResponse<AuthResult>> => {
    try {
      const response = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      return data;
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      return {
        statusCode: 999, // Uncategorized error
        message: 'Lỗi kết nối đến máy chủ',
        result: { authenticated: false, token: '' }
      };
    }
  },
  
  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/introspect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      return data.result?.valid || false;
    } catch (error) {
      console.error('Lỗi xác thực token:', error);
      return false;
    }
  },

  getUserInfo: async (token: string): Promise<UserInfo | null> => {
    try {
      const response = await fetch(`${API_URL}/user/myInfo`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.result;
      }
      return null;
    } catch (error) {
      console.error('Lỗi lấy thông tin người dùng:', error);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }
};
```

Xem chi tiết ở: `Frontend/src/services`.

<!-- GETTING STARTED -->
## 4. Hướng dẫn cài đặt
### 2.1. Yêu cầu phần cứng
* **Hệ điều hành**: Windows 10 trở lên
* **Bộ nhớ**: tối thiểu 1GB trống
* **Ram**: tối thiểu 1GB

### 4.2. Yêu cầu phần mềm
* Java JDK 23
* NodeJs version 22
* SQLServer 2022
* Git

### 4.3. Cài đặt
#### Bước 1: Tải các phần mềm cần thiết và thiết lập hệ thống
* Truy cập vào link và download: https://1drv.ms/f/c/6ea1f55d8aeb35fa/EncaWfI9ZCFJl2zzPVHr2h8BIt4AAPmAANoDDFy-Nu6wRA 
* Tìm kiếm và mở Powershell:
  ![alt text](/public/readme%20images/image-22.png)
* Trỏ đến thư mục Script đã tải xuống:
  `cd <Installed path>\Script`
  ![alt text](/public/readme%20images/image-23.png)
* Gõ vào lệnh và nhấn Enter:
  `Set-ExecutionPolicy Bypass -Scope Process -Force`
* Cài đặt các phần mềm cần thiết và cấu hình database:
  Gõ `.\configure.ps1`

#### Bước 2: Sau khi cài đặt xong SQL Server, cần phải cấu hình cho database để BackEnd có thể kết nối
* Mở SQL Server Configuration Manager
  ![alt text](/public/readme%20images/image-24.png)
* Trỏ đến mục "Protocol for SQLEXPRESS
  ![alt text](/public/readme%20images/image-25.png)
* Đúp chuột vào TCP/IP, chọn Enable = YES
  ![alt text](/public/readme%20images/image-26.png)
* Chọn tab IP Addresses, set 1433 vào ô IPALL/TCP Port
  ![alt text](/public/readme%20images/image-27.png)
* Nhấn Apply
* Quay lại tab SQL Server Services, chuột phải vào SQLEXPRESS, chọn restart
  ![alt text](/public/readme%20images/image-28.png)

#### Bước 3: Tải về source code của hệ thống, tạo package backend
Quay lại thư mục Script như ở bước trước, chạy script **Install FE+BE**.
![alt text](/public/readme%20images/image-29.png)

#### Bước 4: Sửa thông tin địa chủ máy chủ trong FrontEnd
* Truy cập vào thư mục: **multiple_choice_exam\FrontEnd**
* Mở file **.env** bằng notepad
  ![alt text](/public/readme%20images/image-30.png)
* Chỉnh sửa dòng VITE_API_URL bằng địa chỉ của máy trong mạng cục bộ

**Hướng dẫn lấy địa chỉ IP của máy trong mạng cục bộ**
* Bấm Windows + R, gõ cmd rồi nhấn Enter
  ![alt text](/public/readme%20images/image-31.png)
* Màn hình Command Prompt hiện lên, gõ lệnh **ipconfig**
* Tìm đến mục *Wireless LAN adapter Wi-Fi*, dòng *IPv4 Address*:
  ![alt text](/public/readme%20images/image-32.png)

Kết quả: địa chỉ máy chủ là **http://\<IPv4 Address>:8080/exam**  
Như trong ví dụ, địa chỉ máy chủ là: http://192.168.1.19:8080/exam.  
Chỉnh sửa file .env  
![alt text](/public/readme%20images/image-33.png)

#### Bước 5: Mở ứng dụng
* Lại quay trở về thư mục Script
* Click đúp chuột vào file **run.cmd**
* Chờ khoảng 30s để ứng dụng khởi động
