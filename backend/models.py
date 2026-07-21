from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()


class CaseCategory(Base):
    __tablename__ = "casecategory"

    CaseCategoryID = Column(Integer, primary_key=True, autoincrement=True)
    LookupValue = Column(String)


class CrimeHead(Base):
    __tablename__ = "crimehead"

    CrimeHeadID = Column(Integer, primary_key=True, autoincrement=True)
    LookupValue = Column(String)


class CrimeSubHead(Base):
    __tablename__ = "crimesubhead"

    CrimeSubHeadID = Column(Integer, primary_key=True, autoincrement=True)
    LookupValue = Column(String)


class CaseStatusMaster(Base):
    __tablename__ = "casestatusmaster"

    CaseStatusID = Column(Integer, primary_key=True, autoincrement=True)
    LookupValue = Column(String)


class Court(Base):
    __tablename__ = "court"

    CourtID = Column(Integer, primary_key=True, autoincrement=True)
    LookupValue = Column(String)


class Employee(Base):
    __tablename__ = "employee"

    EmployeeID = Column(Integer, primary_key=True, autoincrement=True)
    LookupValue = Column(String)


class Unit(Base):
    __tablename__ = "unit"

    UnitID = Column(Integer, primary_key=True, autoincrement=True)
    LookupValue = Column(String)


class OccupationMaster(Base):
    __tablename__ = "occupationmaster"

    OccupationID = Column(Integer, primary_key=True, autoincrement=True)
    LookupValue = Column(String)


class ReligionMaster(Base):
    __tablename__ = "religionmaster"

    ReligionID = Column(Integer, primary_key=True, autoincrement=True)
    LookupValue = Column(String)


class CasteMaster(Base):
    __tablename__ = "castemaster"

    caste_master_id = Column(Integer, primary_key=True, autoincrement=True)
    LookupValue = Column(String)


class GravityOffence(Base):
    __tablename__ = "gravityoffence"

    GravityOffenceID = Column(Integer, primary_key=True, autoincrement=True)
    LookupValue = Column(String)


class CaseMaster(Base):
    __tablename__ = "casemaster"

    CaseMasterID = Column(Integer, primary_key=True, autoincrement=True)
    CrimeNo = Column(String)
    CaseNo = Column(String)
    BriefFacts = Column(Text)
    CrimeRegisteredDate = Column(Date)
    PolicePersonID = Column(Integer, ForeignKey("employee.EmployeeID"))
    PoliceStationID = Column(Integer, ForeignKey("unit.UnitID"))
    CaseCategoryID = Column(Integer, ForeignKey("casecategory.CaseCategoryID"))
    GravityOffenceID = Column(Integer, ForeignKey("gravityoffence.GravityOffenceID"))
    CrimeMajorHeadID = Column(Integer, ForeignKey("crimehead.CrimeHeadID"))
    CrimeMinorHeadID = Column(Integer, ForeignKey("crimesubhead.CrimeSubHeadID"))
    CaseStatusID = Column(Integer, ForeignKey("casestatusmaster.CaseStatusID"))
    CourtID = Column(Integer, ForeignKey("court.CourtID"))

    # One CaseMaster -> many Victims / Accused / Complainants
    victims = relationship("Victim", back_populates="case", cascade="all, delete-orphan")
    accused = relationship("Accused", back_populates="case", cascade="all, delete-orphan")
    complainants = relationship("ComplainantDetails", back_populates="case", cascade="all, delete-orphan")


class Victim(Base):
    __tablename__ = "victim"

    VictimMasterID = Column(Integer, primary_key=True, autoincrement=True)
    CaseMasterID = Column(Integer, ForeignKey("casemaster.CaseMasterID"))
    VictimName = Column(String)
    AgeYear = Column(Integer)
    GenderID = Column(Integer)
    VictimPolice = Column(String)

    case = relationship("CaseMaster", back_populates="victims")


class Accused(Base):
    __tablename__ = "accused"

    AccusedMasterID = Column(Integer, primary_key=True, autoincrement=True)
    CaseMasterID = Column(Integer, ForeignKey("casemaster.CaseMasterID"))
    AccusedName = Column(String)
    AgeYear = Column(Integer)
    GenderID = Column(Integer)
    PersonID = Column(String)  # e.g., A1, A2

    case = relationship("CaseMaster", back_populates="accused")


class ComplainantDetails(Base):
    __tablename__ = "complainantdetails"

    ComplainantID = Column(Integer, primary_key=True, autoincrement=True)
    CaseMasterID = Column(Integer, ForeignKey("casemaster.CaseMasterID"))
    ComplainantName = Column(String)
    AgeYear = Column(Integer)
    OccupationID = Column(Integer, ForeignKey("occupationmaster.OccupationID"))
    ReligionID = Column(Integer, ForeignKey("religionmaster.ReligionID"))
    CasteID = Column(Integer, ForeignKey("castemaster.caste_master_id"))
    GenderID = Column(Integer)

    case = relationship("CaseMaster", back_populates="complainants")
