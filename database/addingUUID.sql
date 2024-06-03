--changeset stefan:ddl:addExtensionUuidOssp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--rollback DROP EXTENSION IF EXISTS "uuid-ossp";

--changeset stefan:ddl:addColumnRoomUuid
ALTER TABLE rooms ADD COLUMN room_uuid UUID DEFAULT uuid_generate_v4();
--rollback ALTER TABLE rooms DROP COLUMN room_uuid;