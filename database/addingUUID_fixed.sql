--changeset stefan:ddl:addExtensionUuidOssp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--rollback DROP EXTENSION IF EXISTS "uuid-ossp";

--changeset stefan:ddl:addColumnRoomUuid
--preconditions onFail:MARK_RAN
--precondition-sql-check expectedResult:false
SELECT column_name FROM information_schema.columns WHERE table_name='rooms' AND column_name='room_uuid';
ALTER TABLE rooms ADD COLUMN room_uuid UUID DEFAULT uuid_generate_v4();
--rollback ALTER TABLE rooms DROP COLUMN room_uuid;