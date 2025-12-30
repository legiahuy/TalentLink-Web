# Admin API Documentation

## Featured Content Management

### TalentLink Platform

### December 20, 2024

### Version 1.0.

## Production Ready

```
Base URL: https://api.talentlink.io.vn
```

## Contents

- 1 Admin Account
   - 1.1 Test Admin Credentials
   - 1.2 How to Login
      - 1.2.1 cURL Example
      - 1.2.2 PowerShell Example
      - 1.2.3 Response Example
- 2 Authentication Requirements
- 3 Featured Users Management
   - 3.1 Mark User as Featured
      - 3.1.1 Path Parameters
      - 3.1.2 Example Request
      - 3.1.3 Success Response (200 OK)
      - 3.1.4 Error Responses
   - 3.2 Remove User from Featured
      - 3.2.1 Path Parameters
      - 3.2.2 Example Request
      - 3.2.3 Success Response (200 OK)
   - 3.3 List All Featured Users
      - 3.3.1 Query Parameters
      - 3.3.2 Example Request
      - 3.3.3 Success Response (200 OK)
- 4 Featured Jobs Management
   - 4.1 Mark Job Post as Featured
      - 4.1.1 Path Parameters
      - 4.1.2 Example Request
      - 4.1.3 Success Response (200 OK)
   - 4.2 Remove Job Post from Featured
      - 4.2.1 Example Request
   - 4.3 List All Featured Jobs
      - 4.3.1 Query Parameters
- 5 Frontend Implementation Guide
   - 5.1 TypeScript Service Example
- 6 Security Considerations
- 7 Business Rules
   - 7.1 Fallback Mechanism
- 8 Testing Checklist
   - 8.1 Functional Testing
   - 8.2 Error Handling
- 9 Related Endpoints
   - 9.1 Public Landing Page Endpoints (No Auth)
   - 9.2 Existing Search Endpoints
- 10 Support & Contact


## 1 Admin Account

### 1.1 Test Admin Credentials

```
ø Test Credentials
Email: testadmin@talentlink.io.vn
Password: Admin@
Role: admin
```
### 1.2 How to Login

#### 1.2.1 cURL Example

```
1 curl -X POST "https :// api.talentlink.io.vn/api/v1/auth/login" \
2 -H "Content -Type: application/json" \
3 -d ’{
4 "email ": "admin@talentlink.io.vn",
5 "password ": "your_admin_password"
6 }’
Listing 1: Login with cURL
```
#### 1.2.2 PowerShell Example

1 $loginData = @{
2 email = "admin@talentlink.io.vn"
3 password = "your_admin_password"
4 } | ConvertTo -Json
5
6 $response = Invoke -RestMethod ‘
7 -Uri "https ://api.talentlink.io.vn/api/v1/auth/login" ‘
8 -Method Post ‘
9 -ContentType "application/json" ‘
10 -Body $loginData
11
12 $adminToken = $response.data.accessToken
13 Write -Host "Admin Token: $adminToken"

```
Listing 2: Login with PowerShell
```
#### 1.2.3 Response Example

1 {
2 "data": {
3 "accessToken ": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 ...",
4 "refreshToken ": "...",
5 "user": {
6 "id": "...",
7 "email": "admin@talentlink.io.vn",
8 "role": "admin"
9 }
10 }
11 }

```
Listing 3: Login Response
```

## 2 Authentication Requirements

```
 Authentication Required
```
```
All admin endpoints require:
```
- Role: admin
- Header: Authorization: Bearer <admin_jwt_token>


## 3 Featured Users Management

### 3.1 Mark User as Featured

```
Endpoint: POST /api/v1/admin/users/{id}/feature
Description: Admin marks a user as featured for landing page display
Authentication:✓ Required - Admin role only
```
#### 3.1.1 Path Parameters

```
Parameter Type Required Description
id UUID Yes User ID to feature
```
#### 3.1.2 Example Request

1 curl -X POST \
2 "https ://api.talentlink.io.vn/api/v1/admin/users /71835d3b -5740 -407b-9e46 -
a3449accb980/feature" \
3 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 ..."

```
Listing 4: Feature User - cURL
```
1 $token = "your_admin_token"
2 $userId = "71835d3b -5740 -407b-9e46 -a3449accb980"
3
4 Invoke -RestMethod ‘
5 -Uri "https ://api.talentlink.io.vn/api/v1/admin/users/$userId/feature" ‘
6 -Method Post ‘
7 -Headers @{ Authorization = "Bearer $token" }

```
Listing 5: Feature User - PowerShell
```
#### 3.1.3 Success Response (200 OK)

1 {
2 "message ": "User featured successfully"
3 }

#### 3.1.4 Error Responses

1 {
2 "error ": "Bad Request",
3 "message ": "invalid user id"
4 }

```
Listing 6: 400 Bad Request
```
1 {
2 "code": 403,
3 "message ": "Forbidden - Admin access required"
4 }

```
Listing 7: 403 Forbidden
```

1 {
2 "error ": "Not Found",
3 "message ": "user not found"
4 }

```
Listing 8: 404 Not Found
```

### 3.2 Remove User from Featured

```
Endpoint: DELETE /api/v1/admin/users/{id}/feature
Description: Admin removes featured status from a user
Authentication:✓ Required - Admin role only
```
#### 3.2.1 Path Parameters

```
Parameter Type Required Description
id UUID Yes User ID to unfeature
```
#### 3.2.2 Example Request

1 curl -X DELETE \
2 "https ://api.talentlink.io.vn/api/v1/admin/users /71835d3b -5740 -407b-9e46 -
a3449accb980/feature" \
3 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 ..."

```
Listing 9: Unfeature User - cURL
```
#### 3.2.3 Success Response (200 OK)

1 {
2 "message ": "User unfeatured successfully"
3 }

### 3.3 List All Featured Users

```
Endpoint: GET /api/v1/admin/users/featured
Description: Get paginated list of all users currently marked as featured
Authentication:✓ Required - Admin role only
```
#### 3.3.1 Query Parameters

```
Parameter Type Required Default Description
limit integer No 50 Items per page (max: 100)
offset integer No 0 Pagination offset
```
#### 3.3.2 Example Request

1 curl -X GET \
2 "https ://api.talentlink.io.vn/api/v1/admin/users/featured?limit =20& offset =0"
\
3 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 ..."

```
Listing 10: List Featured Users - cURL
```

#### 3.3.3 Success Response (200 OK)

1 {
2 "data": {
3 "users": [
4 {
5 "id": "71835d3b -5740 -407b-9e46 -a3449accb980",
6 "username ": "bonpaul",
7 "display_name ": "BON",
89 "avatar_url ": "https :// talentlink.io.vn/storage/user -media/avatar/acedfb4d.png", "role": "producer",
10 "brief_bio ": "Vietnamese DJ/Producer",
11 "city": "Ho Chi Minh",
12 "country ": "Vietnam",
13 "genres ": [
14 {"id": "...", "name": "Acting"},
15 {"id": "...", "name": "Rapping "}
16 ],
17 "is_verified ": true ,
18 "is_featured ": true ,
19 "featured_at ": "2024 -12 -20 T10 :30:00Z",
20 "created_at ": "2025 -11 -25 T15 :10:44.202791Z"
21 }
22 ],
23 "total": 15,
24 "limit": 20,
25 "offset ": 0
26 }
27 }


## 4 Featured Jobs Management

### 4.1 Mark Job Post as Featured

```
Endpoint: POST /api/v1/admin/posts/{id}/feature
Description: Admin marks a job post as featured for landing page display
Authentication:✓ Required - Admin role only
```
#### 4.1.1 Path Parameters

```
Parameter Type Required Description
id UUID Yes Job Post ID to feature
```
#### 4.1.2 Example Request

1 curl -X POST \
2 "https ://api.talentlink.io.vn/api/v1/admin/posts/acb97ceb -ad3a -41e2-a8b9 -
a5ec8386/feature" \
3 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 ..."

```
Listing 11: Feature Job - cURL
```
#### 4.1.3 Success Response (200 OK)

1 {
2 "message ": "Job featured successfully"
3 }

### 4.2 Remove Job Post from Featured

```
Endpoint: DELETE /api/v1/admin/posts/{id}/feature
Description: Admin removes featured status from a job post
Authentication:✓ Required - Admin role only
```
#### 4.2.1 Example Request

1 curl -X DELETE \
2 "https ://api.talentlink.io.vn/api/v1/admin/posts/acb97ceb -ad3a -41e2-a8b9 -
a5ec8386/feature" \
3 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 ..."

```
Listing 12: Unfeature Job - cURL
```
### 4.3 List All Featured Jobs

```
Endpoint: GET /api/v1/admin/posts/featured
Description: Get paginated list of all job posts currently marked as featured
Authentication:✓ Required - Admin role only
```
#### 4.3.1 Query Parameters


```
Parameter Type Required Default Description
limit integer No 50 Items per page (max: 100)
offset integer No 0 Pagination offset
```
## 5 Frontend Implementation Guide

### 5.1 TypeScript Service Example

1 // services/adminFeaturedService.ts
2 import axios from ’axios’;
3
4 const API_BASE = ’https ://api.talentlink.io.vn/api/v1/admin ’;
5
6 const getAuthHeader = (token: string) => ({
7 Authorization: ‘Bearer ${token}‘
8 });
9
10 // Featured Users API
11 export const featuredUsersAPI = {
12 list: async (token: string , limit = 50, offset = 0) => {
13 const response = await axios.get(
14 ‘${API_BASE }/ users/featured ‘,
15 {
16 params: { limit , offset },
17 headers: getAuthHeader(token)
18 }
19 );
20 return response.data;
21 },
22
23 feature: async (token: string , userId: string) => {
24 const response = await axios.post(
25 ‘${API_BASE }/ users/${userId }/feature ‘,
26 {},
27 { headers: getAuthHeader(token) }
28 );
29 return response.data;
30 },
31
32 unfeature: async (token: string , userId: string) => {
33 const response = await axios.delete(
34 ‘${API_BASE }/ users/${userId }/feature ‘,
35 { headers: getAuthHeader(token) }
36 );
37 return response.data;
38 }
39 };
40
41 // Featured Jobs API
42 export const featuredJobsAPI = {
43 list: async (token: string , limit = 50, offset = 0) => {
44 const response = await axios.get(
45 ‘${API_BASE }/ posts/featured ‘,
46 {
47 params: { limit , offset },
48 headers: getAuthHeader(token)
49 }
50 );
51 return response.data;
52 },
53
54 feature: async (token: string , jobId: string) => {
55 const response = await axios.post(
56 ‘${API_BASE }/ posts/${jobId}/feature ‘,
57 {},
58 { headers: getAuthHeader(token) }
59 );
60 return response.data;
61 },


62
63 unfeature: async (token: string , jobId: string) => {
64 const response = await axios.delete(
65 ‘${API_BASE }/ posts/${jobId}/feature ‘,
66 { headers: getAuthHeader(token) }
67 );
68 return response.data;
69 }
70 };

```
Listing 13: adminFeaturedService.ts
```

## 6 Security Considerations

1. Role Verification: Backend validates admin role on every request
2. Token Expiration: Ensure frontend refreshes tokens properly
3. Audit Logging: Backend logs all feature/unfeature actions
4. Rate Limiting: Admin endpoints have rate limits (5 req/s)
5. HTTPS Only: All admin operations must use HTTPS
6. Session Timeout: Implement 30-minute inactivity timeout

## 7 Business Rules

. Important Rules
    - Maximum Featured Users: 50 (recommended, not enforced by backend)
    - Maximum Featured Jobs: 50 (recommended, not enforced by backend)
    - Landing Page Display: 10 items each (configurable via query param)
    - Cache Duration: 5 minutes on landing page
    - Featured Status: Persists until manually removed by admin

### 7.1 Fallback Mechanism

If fewer than 10 featured items exist, the system fills with random quality content based on:
Quality Criteria:

- Users: verified, has avatar, active in 90 days
- Jobs: published, recent (30 days), high views

## 8 Testing Checklist

### 8.1 Functional Testing

```
□ Admin can login with admin account
```
```
□ Admin can view list of featured users
```
```
□ Admin can view list of featured jobs
```
```
□ Admin can search users
```
```
□ Admin can search jobs
```
```
□ Admin can feature a user
```
```
□ Admin can feature a job
```
```
□ Admin can remove user from featured
```
```
□ Admin can remove job from featured
```

```
□ Pagination works for large lists
```
```
□ Search auto-complete works
```
```
□ Confirmation dialogs appear before actions
```
### 8.2 Error Handling

```
□ Handle 403 Forbidden (non-admin user)
```
```
□ Handle 404 Not Found (invalid ID)
```
```
□ Handle 500 Internal Server Error
```
```
□ Handle network errors
```
```
□ Handle token expiration
```
```
□ Show error messages in UI
```

## 9 Related Endpoints

### 9.1 Public Landing Page Endpoints (No Auth)

- GET /api/v1/landing/featured-users?limit=
- GET /api/v1/landing/featured-jobs?limit=

### 9.2 Existing Search Endpoints

- GET /api/v1/search/users?q=query - Search users to feature
- GET /api/v1/search/posts?q=query - Search jobs to feature

## 10 Support & Contact

```
ò Backend Information
API Base URL: https://api.talentlink.io.vn
Swagger Documentation:
```
- User Service: https://api.talentlink.io.vn/docs/user-service/index.html
- Job Service: https://api.talentlink.io.vn/docs/job-post-service/index.
    html

```
API Version: 1.0.
Last Updated: December 20, 2024
Status:¥ Production Ready
Environment: Production
```

