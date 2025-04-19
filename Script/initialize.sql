ALTER LOGIN sa ENABLE;
GO
ALTER LOGIN sa WITH PASSWORD = 'root';
GO

create database multiple_choice_exam;

EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE',
    N'Software\Microsoft\MSSQLServer\MSSQLServer',
    N'LoginMode', REG_DWORD, 2;
GO