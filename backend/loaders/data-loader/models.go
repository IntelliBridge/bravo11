package main

import (
	"strings"
	"time"
)

type SourceType string

const (
	SourceTypeSatelliteAccess   SourceType = "SatelliteAccess"
	SourceTypeADSB              SourceType = "ADSB"
	SourceTypeACLED             SourceType = "ACLED"
	SourceTypeCountryAssessment SourceType = "CountryAssessment"
	SourceTypeGDELTExport       SourceType = "GDELTExport"
	SourceTypeGDELTMention      SourceType = "GDELTMention"
	SourceTypeInfra             SourceType = "Infra"
	SourceTypeNatoRedBlue       SourceType = "NATORedBlue"
	SourceTypeAIS               SourceType = "AIS"
)

type AssetType string

const (
	AssetTypeSatellite AssetType = "Satellite"
	AssetTypeAircraft  AssetType = "Aircraft"
	AssetTypeVessel    AssetType = "Vessel"
)

//type Flight struct {
//	Hex         string       `json:"hex,omitempty"`
//	Type        string       `json:"type,omitempty"`
//	Flight      string       `json:"flight,omitempty"`
//	R           string       `json:"r,omitempty"`
//	T           string       `json:"t,omitempty"`
//	AltBaro     int          `json:"alt_baro,omitempty"`
//	GS          float32      `json:"gs,omitempty"`
//	Track       float32      `json:"track,omitempty"`
//	BaroRate    int          `json:"baro_rate,omitempty"`
//	Squawk      string       `json:"squawk,omitempty"'`
//	Category    string       `json:"category"`
//	Lat         string       `json:"lat,omitempty"`
//	Lon         string       `json:"lon,omitempty"`
//	Location    *GeoLocation `json:"Location,omitempty"`
//	LastUpdated time.Time    `json:"LASTUPDATED"`
//	AltBaro     string       `json:"alt_baro,omitempty"`
//	// Include other fields as necessary.
//}

type AssetLocation struct {
	EntityID   string     `json:"entityId"`
	AssetType  AssetType  `json:"assetType"`
	SourceType SourceType `json:"sourceType"`
	Location   Location   `json:"location"`
	Timestamp  time.Time  `json:"timestamp"`
}

type Location struct {
	Lat float64 `json:"lat"`
	Lon float64 `json:"lon"`
}
type GeoLocation struct {
	Lat string `json:"lat"`
	Lon string `json:"lon"`
}

func (g GeoLocation) isValid() bool {
	return g.Lat != "" && g.Lon != ""
}

func (g GeoLocation) ToGeoPointStr() string {
	return strings.Join([]string{g.Lat, g.Lon}, ",")
}

const AIS_MAPPING = `
{
    "properties": {
      "location": {
        "type": "geo_point"
      },
      "basedatetime": {
        "type": "date"
      }
    }
}
`

const ADSB_MAPPING = `
{
    "properties": {
      "location": {
        "type": "geo_point"
      },
      "time": {
        "type": "date"
      }
    }
}
`

const ASSET_MAPPING = `
{
    "properties": {
      "location": {
        "type": "geo_point"
      },
      "timestamp": {
        "type": "date"
      }
    }
}
`

const NATO_RED_BLUE_MAPPING = `
{
    "properties": {
      "geo_point": {
        "type": "geo_point"
      }
    }
}
`

const INFRA_MAPPING = `
{
    "properties": {
      "location": {
        "type": "geo_point"
      }
    }
}
`
const ACLED_MAPPING = `
{
    "properties": {
      "location": {
        "type": "geo_point"
      },
      "timestamp": {
        "type": "date"
      }
    }
}
`

const SATELLITE_MAPPING = `
{
    "properties": {
      "location": {
        "type": "geo_point"
      },
      "access_start": {
        "type": "date"
      },
      "access_end": {
        "type": "date"
      }
    }
}
`

const GDELT_EXPORT_MAPPING = `
{
    "properties": {
      "action_location": {
        "type": "geo_point"
      },
      "actor1_location": {
        "type": "geo_point"
      },
      "actor2_location": {
        "type": "geo_point"
      },
      "dateadded": {
        "type": "date"
      }
    }
}
`

var GDELT_MENTION_HEADER = []string{
	"GlobalEventID",
	"EventTimeDate",
	"MentionTimeDate",
	"MentionType",
	"MentionSourceName",
	"MentionIdentifier",
	"SentenceID",
	"Actor1CharOffset",
	"Actor2CharOffset",
	"ActionCharOffset",
	"InRawText",
	"Confidence",
	"MentionDocLen",
	"MentionDocTone",
	"MentionDocTranslationInfo",
	//"Extras",
}

var GDELT_EXPORT_HEADER = []string{
	"GLOBALEVENTID",         //INTEGER,NULLABLE,"Globally unique identifier assigned to each event record that uniquely identifies it in the master dataset.  NOTE: While these will often be sequential with date, this is NOT always the case and this field should NOT be used to sort events by date: the date fields should be used for this.  NOTE: There is a large gap in the sequence between February 18, 2015 and February 19, 2015 with the switchover to GDELT 2.0 – these are not missing events, the ID sequence was simply reset at a higher number so that it is possible to easily distinguish events created after the switchover to GDELT 2.0 from those created using the older GDELT 1.0 system."
	"SQLDATE",               //INTEGER,NULLABLE,Date the event took place in YYYYMMDD format.  See DATEADDED field for YYYYMMDDHHMMSS date.
	"MonthYear",             //INTEGER,NULLABLE,"Alternative formatting of the event date, in YYYYMM format."
	"Year",                  //INTEGER,NULLABLE,"Alternative formatting of the event date, in YYYY format."
	"FractionDate",          //FLOAT,NULLABLE,"Alternative formatting of the event date, computed as YYYY.FFFF, where FFFF is the percentage of the year completed by that day.  This collapses the month and day into a fractional range from 0 to 0.9999, capturing the 365 days of the year.  The fractional component (FFFF) is computed as (MONTH * 30 + DAY) / 365.  This is an approximation and does not correctly take into account the differing numbers of days in each month or leap years, but offers a simple single-number sorting mechanism for applications that wish to estimate the rough temporal distance between dates."
	"Actor1Code",            //STRING,NULLABLE,"The complete raw CAMEO code for Actor1 (includes geographic, class, ethnic, religious, and type classes).  May be blank if the system was unable to identify an Actor1."
	"Actor1Name",            //STRING,NULLABLE,"The actual name of the Actor1.  In the case of a political leader or organization, this will be the leader’s formal name (GEORGE W BUSH, UNITED NATIONS), for a geographic match it will be either the country or capital/major city name (UNITED STATES / PARIS), and for ethnic, religious, and type matches it will reflect the root match class (KURD, CATHOLIC, POLICE OFFICER, etc).  May be blank if the system was unable to identify an Actor1."
	"Actor1CountryCode",     //STRING,NULLABLE,The 3-character CAMEO code for the country affiliation of Actor1.  May be blank if the system was unable to identify an Actor1 or determine its country affiliation (such as “UNIDENTIFIED GUNMEN”).
	"Actor1KnownGroupCode",  //STRING,NULLABLE,"If Actor1 is a known IGO/NGO/rebel organization (United Nations, World Bank, al-Qaeda, etc) with its own CAMEO code, this field will contain that code."
	"Actor1EthnicCode",      //STRING,NULLABLE,"If the source document specifies the ethnic affiliation of Actor1 and that ethnic group has a CAMEO entry, the CAMEO code is entered here.  NOTE: a few special groups like ARAB may also have entries in the type column due to legacy CAMEO behavior.  NOTE: this behavior is highly experimental and may not capture all affiliations properly – for more comprehensive and sophisticated identification of ethnic affiliation, it is recommended that users use the GDELT Global Knowledge Graph’s ethnic, religious, and social group taxonomies and post-enrich actors from the GKG."
	"Actor1Religion1Code",   //STRING,NULLABLE,"If the source document specifies the religious affiliation of Actor1 and that religious group has a CAMEO entry, the CAMEO code is entered here.  NOTE: a few special groups like JEW may also have entries in the geographic or type columns due to legacy CAMEO behavior.  NOTE: this behavior is highly experimental and may not capture all affiliations properly – for more comprehensive and sophisticated identification of ethnic affiliation, it is recommended that users use the GDELT Global Knowledge Graph’s ethnic, religious, and social group taxonomies and post-enrich actors from the GKG."
	"Actor1Religion2Code",   //STRING,NULLABLE,"If multiple religious codes are specified for Actor1, this contains the secondary code.  Some religion entries automatically use two codes, such as Catholic, which invokes Christianity as Code1 and Catholicism as Code2."
	"Actor1Type1Code",       //STRING,NULLABLE,"The 3-character CAMEO code of the CAMEO “type” or “role” of Actor1, if specified.  This can be a specific role such as Police Forces, Government, Military, Political Opposition, Rebels, etc, a broad role class such as Education, Elites, Media, Refugees, or organizational classes like Non-Governmental Movement.  Special codes such as Moderate and Radical may refer to the operational strategy of a group."
	"Actor1Type2Code",       //,STRING,NULLABLE,"If multiple type/role codes are specified for Actor1, this returns the second code."
	"Actor1Type3Code",       //STRING,NULLABLE,"If multiple type/role codes are specified for Actor1, this returns the third code."
	"Actor2Code",            //STRING,NULLABLE,"The complete raw CAMEO code for Actor2 (includes geographic, class, ethnic, religious, and type classes).  May be blank if the system was unable to identify an Actor2."
	"Actor2Name",            //STRING,NULLABLE,"=The actual name of the Actor2.  In the case of a political leader or organization, this will be the leader’s formal name (GEORGE W BUSH, UNITED NATIONS), for a geographic match it will be either the country or capital/major city name (UNITED STATES / PARIS), and for ethnic, religious, and type matches it will reflect the root match class (KURD, CATHOLIC, POLICE OFFICER, etc).  May be blank if the system was unable to identify an Actor2."
	"Actor2CountryCode",     //STRING,NULLABLE,The 3-character CAMEO code for the country affiliation of Actor2.  May be blank if the system was unable to identify an Actor1 or determine its country affiliation (such as “UNIDENTIFIED GUNMEN”).
	"Actor2KnownGroupCode",  //STRING,NULLABLE,"If Actor2 is a known IGO/NGO/rebel organization (United Nations, World Bank, al-Qaeda, etc) with its own CAMEO code, this field will contain that code."
	"Actor2EthnicCode",      //STRING,NULLABLE,"If the source document specifies the ethnic affiliation of Actor2 and that ethnic group has a CAMEO entry, the CAMEO code is entered here.  NOTE: a few special groups like ARAB may also have entries in the type column due to legacy CAMEO behavior.  NOTE: this behavior is highly experimental and may not capture all affiliations properly – for more comprehensive and sophisticated identification of ethnic affiliation, it is recommended that users use the GDELT Global Knowledge Graph’s ethnic, religious, and social group taxonomies and post-enrich actors from the GKG."
	"Actor2Religion1Code",   //STRING,NULLABLE,"If the source document specifies the religious affiliation of Actor2 and that religious group has a CAMEO entry, the CAMEO code is entered here.  NOTE: a few special groups like JEW may also have entries in the geographic or type columns due to legacy CAMEO behavior.  NOTE: this behavior is highly experimental and may not capture all affiliations properly – for more comprehensive and sophisticated identification of ethnic affiliation, it is recommended that users use the GDELT Global Knowledge Graph’s ethnic, religious, and social group taxonomies and post-enrich actors from the GKG."
	"Actor2Religion2Code",   //STRING,NULLABLE,"If multiple religious codes are specified for Actor2, this contains the secondary code.  Some religion entries automatically use two codes, such as Catholic, which invokes Christianity as Code1 and Catholicism as Code2."
	"Actor2Type1Code",       //STRING,NULLABLE,"The 3-character CAMEO code of the CAMEO “type” or “role” of Actor2, if specified.  This can be a specific role such as Police Forces, Government, Military, Political Opposition, Rebels, etc, a broad role class such as Education, Elites, Media, Refugees, or organizational classes like Non-Governmental Movement.  Special codes such as Moderate and Radical may refer to the operational strategy of a group."
	"Actor2Type2Code",       //STRING,NULLABLE,"If multiple type/role codes are specified for Actor2, this returns the second code."
	"Actor2Type3Code",       //STRING,NULLABLE,"If multiple type/role codes are specified for Actor2, this returns the third code."
	"IsRootEvent",           //INTEGER,NULLABLE,"The system codes every event found in an entire document, using an array of techniques to deference and link information together.  A number of previous projects such as the ICEWS initiative have found that events occurring in the lead paragraph of a document tend to be the most “important.”  This flag can therefore be used as a proxy for the rough importance of an event to create subsets of the event stream.  NOTE: this field refers only to the first news report to mention an event and is not updated if the event is found in a different context in other news reports.  It is included for legacy purposes – for more precise information on the positioning of an event, see the Mentions table."
	"EventCode",             //STRING,NULLABLE,"This is the raw CAMEO action code describing the action that Actor1 performed upon Actor2.  NOTE: it is strongly recommended that this field be stored as a string instead of an integer, since the CAMEO taxonomy can include zero-leaded event codes that can make distinguishing between certain event types more difficult when stored as an integer."
	"EventBaseCode",         //STRING,NULLABLE,"CAMEO event codes are defined in a three-level taxonomy.  For events at level three in the taxonomy, this yields its level two leaf root node.  For example, code “0251” (“Appeal for easing of administrative sanctions”) would yield an EventBaseCode of “025” (“Appeal to yield”).  This makes it possible to aggregate events at various resolutions of specificity.  For events at levels two or one, this field will be set to EventCode.  NOTE: it is strongly recommended that this field be stored as a string instead of an integer, since the CAMEO taxonomy can include zero-leaded event codes that can make distinguishing between certain event types more difficult when stored as an integer."
	"EventRootCode",         //STRING,NULLABLE,"Similar to EventBaseCode, this defines the root-level category the event code falls under.  For example, code “0251” (“Appeal for easing of administrative sanctions”) has a root code of “02” (“Appeal”).  This makes it possible to aggregate events at various resolutions of specificity.  For events at levels two or one, this field will be set to EventCode.  NOTE: it is strongly recommended that this field be stored as a string instead of an integer, since the CAMEO taxonomy can include zero-leaded event codes that can make distinguishing between certain event types more difficult when stored as an integer."
	"QuadClass",             //INTEGER,NULLABLE,"The entire CAMEO event taxonomy is ultimately organized under four primary classifications: Verbal Cooperation, Material Cooperation, Verbal Conflict, and Material Conflict.  This field specifies this primary classification for the event type, allowing analysis at the highest level of aggregation.  The numeric codes in this field map to the Quad Classes as follows: 1=Verbal Cooperation, 2=Material Cooperation, 3=Verbal Conflict, 4=Material Conflict."
	"GoldsteinScale",        //FLOAT,NULLABLE,"Each CAMEO event code is assigned a numeric score from -10 to +10, capturing the theoretical potential impact that type of event will have on the stability of a country.  This is known as the Goldstein Scale.  This field specifies the Goldstein score for each event type.  NOTE: this score is based on the type of event, not the specifics of the actual event record being recorded – thus two riots, one with 10 people and one with 10,000, will both receive the same Goldstein score.  This can be aggregated to various levels of time resolution to yield an approximation of the stability of a location over time."
	"NumMentions",           //INTEGER,NULLABLE,"This is the total number of mentions of this event across all source documents during the 15 minute update in which it was first seen.  Multiple references to an event within a single document also contribute to this count.  This can be used as a method of assessing the “importance” of an event: the more discussion of that event, the more likely it is to be significant.  The total universe of source documents and the density of events within them vary over time, so it is recommended that this field be normalized by the average or other measure of the universe of events during the time period of interest.  This field is actually a composite score of the total number of raw mentions and the number of mentions extracted from reprocessed versions of each article (see the discussion for the Mentions table).   NOTE: this field refers only to the first news report to mention an event and is not updated if the event is found in a different context in other news reports.  It is included for legacy purposes – for more precise information on the positioning of an event, see the Mentions table."
	"NumSources",            //INTEGER,NULLABLE,"This is the total number of information sources containing one or more mentions of this event during the 15 minute update in which it was first seen.  This can be used as a method of assessing the “importance” of an event: the more discussion of that event, the more likely it is to be significant.  The total universe of sources varies over time, so it is recommended that this field be normalized by the average or other measure of the universe of events during the time period of interest.  NOTE: this field refers only to the first news report to mention an event and is not updated if the event is found in a different context in other news reports.  It is included for legacy purposes – for more precise information on the positioning of an event, see the Mentions table."
	"NumArticles",           //INTEGER,NULLABLE,"This is the total number of source documents containing one or more mentions of this event during the 15 minute update in which it was first seen.  This can be used as a method of assessing the “importance” of an event: the more discussion of that event, the more likely it is to be significant.  The total universe of source documents varies over time, so it is recommended that this field be normalized by the average or other measure of the universe of events during the time period of interest.  NOTE: this field refers only to the first news report to mention an event and is not updated if the event is found in a different context in other news reports.  It is included for legacy purposes – for more precise information on the positioning of an event, see the Mentions table."
	"AvgTone",               //FLOAT,NULLABLE,"This is the average “tone” of all documents containing one or more mentions of this event during the 15 minute update in which it was first seen.  The score ranges from -100 (extremely negative) to +100 (extremely positive).  Common values range between -10 and +10, with 0 indicating neutral.  This can be used as a method of filtering the “context” of events as a subtle measure of the importance of an event and as a proxy for the “impact” of that event.  For example, a riot event with a slightly negative average tone is likely to have been a minor occurrence, whereas if it had an extremely negative average tone, it suggests a far more serious occurrence.  A riot with a positive score likely suggests a very minor occurrence described in the context of a more positive narrative (such as a report of an attack occurring in a discussion of improving conditions on the ground in a country and how the number of attacks per day has been greatly reduced).  NOTE: this field refers only to the first news report to mention an event and is not updated if the event is found in a different context in other news reports.  It is included for legacy purposes – for more precise information on the positioning of an event, see the Mentions table.  NOTE: this provides only a basic tonal assessment of an article and it is recommended that users interested in emotional measures use the Mentions and Global Knowledge Graph tables to merge the complete set of 2,300 emotions and themes from the GKG GCAM system into their analysis of event records."
	"Actor1Geo_Type",        //INTEGER,NULLABLE,"This field specifies the geographic resolution of the match type and holds one of the following values:  1=COUNTRY (match was at the country level), 2=USSTATE (match was to a US state), 3=USCITY (match was to a US city or landmark), 4=WORLDCITY (match was to a city or landmark outside the US), 5=WORLDSTATE (match was to an Administrative Division 1 outside the US – roughly equivalent to a US state).  This can be used to filter events by geographic specificity, for example, extracting only those events with a landmark-level geographic resolution for mapping.  Note that matches with codes 1 (COUNTRY), 2 (USSTATE), and 5 (WORLDSTATE) will still provide a latitude/longitude pair, which will be the centroid of that country or state, but the FeatureID field below will be blank."
	"Actor1Geo_FullName",    //STRING,NULLABLE,"This is the full human-readable name of the matched location.  In the case of a country it is simply the country name.  For US and World states it is in the format of “State, Country Name”, while for all other matches it is in the format of “City/Landmark, State, Country”.  This can be used to label locations when placing events on a map.  NOTE: this field reflects the precise name used to refer to the location in the text itself, meaning it may contain multiple spellings of the same location – use the FeatureID column to determine whether two location names refer to the same place."
	"Actor1Geo_CountryCode", //STRING,NULLABLE,This is the 2-character FIPS10-4 country code for the location.
	"Actor1Geo_ADM1Code",    //STRING,NULLABLE,"This is the 2-character FIPS10-4 country code followed by the 2-character FIPS10-4 administrative division 1 (ADM1) code for the administrative division housing the landmark.  In the case of the United States, this is the 2-character shortform of the state’s name (such as “TX” for Texas)."
	"Actor1Geo_ADM2Code",    //STRING,NULLABLE,"For international locations this is the numeric Global Administrative Unit Layers (GAUL) administrative division 2 (ADM2) code assigned to each global location, while for US locations this is the two-character shortform of the state’s name (such as “TX” for Texas) followed by the 3-digit numeric county code (following the INCITS 31:200x standard used in GNIS).  For more detail on the contents and computation of this field, please see the following footnoted URL.    NOTE:  This field may be blank/null in cases where no ADM2 information was available, for some ADM1-level matches, and for all country-level matches.  NOTE: this field may still contain a value for ADM1-level matches depending on how they are codified in GNS."
	"Actor1Geo_Lat",         //FLOAT,NULLABLE,This is the centroid latitude of the landmark for mapping.
	"Actor1Geo_Long",        //FLOAT,NULLABLE,This is the centroid longitude of the landmark for mapping.
	"Actor1Geo_FeatureID",   //STRING,NULLABLE,"This is the GNS or GNIS FeatureID for this location.  More information on these values can be found in Leetaru (2012).   NOTE: When Actor1Geo_Type has a value of 3 or 4 this field will contain a signed numeric value, while it will contain a textual FeatureID in the case of other match resolutions (usually the country code or country code and ADM1 code).  A small percentage of small cities and towns may have a blank value in this field even for Actor1Geo_Type values of 3 or 4: this will be corrected in the 2.0 release of GDELT.  NOTE: This field can contain both positive and negative numbers, see Leetaru (2012) for more information on this."
	"Actor2Geo_Type",        //INTEGER,NULLABLE,"This field specifies the geographic resolution of the match type and holds one of the following values:  1=COUNTRY (match was at the country level), 2=USSTATE (match was to a US state), 3=USCITY (match was to a US city or landmark), 4=WORLDCITY (match was to a city or landmark outside the US), 5=WORLDSTATE (match was to an Administrative Division 1 outside the US – roughly equivalent to a US state).  This can be used to filter events by geographic specificity, for example, extracting only those events with a landmark-level geographic resolution for mapping.  Note that matches with codes 1 (COUNTRY), 2 (USSTATE), and 5 (WORLDSTATE) will still provide a latitude/longitude pair, which will be the centroid of that country or state, but the FeatureID field below will be blank."
	"Actor2Geo_FullName",    //STRING,NULLABLE,"This is the full human-readable name of the matched location.  In the case of a country it is simply the country name.  For US and World states it is in the format of “State, Country Name”, while for all other matches it is in the format of “City/Landmark, State, Country”.  This can be used to label locations when placing events on a map.  NOTE: this field reflects the precise name used to refer to the location in the text itself, meaning it may contain multiple spellings of the same location – use the FeatureID column to determine whether two location names refer to the same place."
	"Actor2Geo_CountryCode", //STRING,NULLABLE,This is the 2-character FIPS10-4 country code for the location.
	"Actor2Geo_ADM1Code",    //STRING,NULLABLE,"This is the 2-character FIPS10-4 country code followed by the 2-character FIPS10-4 administrative division 1 (ADM1) code for the administrative division housing the landmark.  In the case of the United States, this is the 2-character shortform of the state’s name (such as “TX” for Texas)."
	"Actor2Geo_ADM2Code",    //STRING,NULLABLE,"For international locations this is the numeric Global Administrative Unit Layers (GAUL) administrative division 2 (ADM2) code assigned to each global location, while for US locations this is the two-character shortform of the state’s name (such as “TX” for Texas) followed by the 3-digit numeric county code (following the INCITS 31:200x standard used in GNIS).  For more detail on the contents and computation of this field, please see the following footnoted URL.    NOTE:  This field may be blank/null in cases where no ADM2 information was available, for some ADM1-level matches, and for all country-level matches.  NOTE: this field may still contain a value for ADM1-level matches depending on how they are codified in GNS."
	"Actor2Geo_Lat",         //FLOAT,NULLABLE,This is the centroid latitude of the landmark for mapping.
	"Actor2Geo_Long",        //FLOAT,NULLABLE,This is the centroid longitude of the landmark for mapping.
	"Actor2Geo_FeatureID",   //STRING,NULLABLE,"This is the GNS or GNIS FeatureID for this location.  More information on these values can be found in Leetaru (2012).   NOTE: When Actor2Geo_Type has a value of 3 or 4 this field will contain a signed numeric value, while it will contain a textual FeatureID in the case of other match resolutions (usually the country code or country code and ADM1 code).  A small percentage of small cities and towns may have a blank value in this field even for Actor2Geo_Type values of 3 or 4: this will be corrected in the 2.0 release of GDELT.  NOTE: This field can contain both positive and negative numbers, see Leetaru (2012) for more information on this."
	"ActionGeo_Type",        //INTEGER,NULLABLE,"This field specifies the geographic resolution of the match type and holds one of the following values:  1=COUNTRY (match was at the country level), 2=USSTATE (match was to a US state), 3=USCITY (match was to a US city or landmark), 4=WORLDCITY (match was to a city or landmark outside the US), 5=WORLDSTATE (match was to an Administrative Division 1 outside the US – roughly equivalent to a US state).  This can be used to filter events by geographic specificity, for example, extracting only those events with a landmark-level geographic resolution for mapping.  Note that matches with codes 1 (COUNTRY), 2 (USSTATE), and 5 (WORLDSTATE) will still provide a latitude/longitude pair, which will be the centroid of that country or state, but the FeatureID field below will be blank."
	"ActionGeo_FullName",    //STRING,NULLABLE,"This is the full human-readable name of the matched location.  In the case of a country it is simply the country name.  For US and World states it is in the format of “State, Country Name”, while for all other matches it is in the format of “City/Landmark, State, Country”.  This can be used to label locations when placing events on a map.  NOTE: this field reflects the precise name used to refer to the location in the text itself, meaning it may contain multiple spellings of the same location – use the FeatureID column to determine whether two location names refer to the same place."
	"ActionGeo_CountryCode", //STRING,NULLABLE,This is the 2-character FIPS10-4 country code for the location.
	"ActionGeo_ADM1Code",    //STRING,NULLABLE,"This is the 2-character FIPS10-4 country code followed by the 2-character FIPS10-4 administrative division 1 (ADM1) code for the administrative division housing the landmark.  In the case of the United States, this is the 2-character shortform of the state’s name (such as “TX” for Texas)."
	"ActionGeo_ADM2Code",    //STRING,NULLABLE,"For international locations this is the numeric Global Administrative Unit Layers (GAUL) administrative division 2 (ADM2) code assigned to each global location, while for US locations this is the two-character shortform of the state’s name (such as “TX” for Texas) followed by the 3-digit numeric county code (following the INCITS 31:200x standard used in GNIS).  For more detail on the contents and computation of this field, please see the following footnoted URL.    NOTE:  This field may be blank/null in cases where no ADM2 information was available, for some ADM1-level matches, and for all country-level matches.  NOTE: this field may still contain a value for ADM1-level matches depending on how they are codified in GNS."
	"ActionGeo_Lat",         //FLOAT,NULLABLE,This is the centroid latitude of the landmark for mapping.
	"ActionGeo_Long",        //FLOAT,NULLABLE,This is the centroid longitude of the landmark for mapping.
	"ActionGeo_FeatureID",   //STRING,NULLABLE,"This is the GNS or GNIS FeatureID for this location.  More information on these values can be found in Leetaru (2012).   NOTE: When ActionGeo_Type has a value of 3 or 4 this field will contain a signed numeric value, while it will contain a textual FeatureID in the case of other match resolutions (usually the country code or country code and ADM1 code).  A small percentage of small cities and towns may have a blank value in this field even for ActionGeo_Type values of 3 or 4: this will be corrected in the 2.0 release of GDELT.  NOTE: This field can contain both positive and negative numbers, see Leetaru (2012) for more information on this."
	"DATEADDED",             //INTEGER,NULLABLE,"This field stores the date the event was added to the master database in YYYYMMDDHHMMSS format in the UTC timezone.  For those needing to access events at 15 minute resolution, this is the field that should be used in queries."
	"SOURCEURL",             //STRING,NULLABLE,"This field records the URL or citation of the first news report it found this event in.  In most cases this is the first report it saw the article in, but due to the timing and flow of news reports through the processing pipeline, this may not always be the very first report, but is at least in the first few reports."

}
