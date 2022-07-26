# Changelog

## v2.0.0

- Revamped the project folder structure
- Fixed dangerous security issues which are listed below:
  - OTP was kept as hidden input in v1.0.0, which could be easily copied from inspecting the webpage itself.
- Revamped the structure of the endpoints exposed to the end user
- Added role based access and authorization restriction to multiple endpoints
- Added admin page, so that they can upload or delete ebooks from this same repo.
- Added session based authentication, instead of a single state in the whole server
- User can verify their account any time, and without verification too, they can just view the ebooks
- **Note**: The older endpoints have changed, and this is a breaking change, which means your existing bookmark might be invalid as of version 2.0.0.

  Please refer `<project-repo>/project_markdowns/endpoints.md` for more insights and details on the same.

-

## v1.0.0

- Added stripe payment gateway
- Created the project with mongoose as the framework to connect to mongodb
- Added email based authentication
