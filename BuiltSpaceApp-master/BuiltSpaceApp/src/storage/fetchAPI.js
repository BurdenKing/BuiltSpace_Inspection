/**
 * Fetches all organization from api
 * Fetches organizations,assetGroups,checklists and questions
 */

const url = 'https://beta.builtspace.com';

export const fetchOrgs = async accountInfo => {
  /**
   * Initial api call to fetch account's oragnizations
   */
  console.log("fetchOrgs method");
  var key = accountInfo.api_key;
  var header = {
    method: 'get',
    headers: {
      Authorization: key,
    },
  };
  var org_list = [];
  var currentDate = new Date();

  try {
    await fetch(`${url}/_vti_bin/wcf/userdata.svc/MyOrganizations`, header)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        // this.setState({api_organization: results});
        for (var i = 0; i < result.length; i++) {
          org_list.push({
            absoluteurl: result[i].absoluteurl,
            brandingurl: result[i].brandingurl,
            id: result[i].id,
            logourl: result[i].logourl,
            name: result[i].name,
            primaryEmail: result[i].primaryemail,
            lastLoaded: currentDate,
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
    return org_list;
  } catch (e) {
    console.log(e);
  }
};

export const get_org_data = async (org_info, key) => {


  console.log("get_org_data method");
  // Calls all the endpoints to get organization's data. 
  // organization id, name
  // bulidings associated with building,
  // assetGroups,
  // checklists 
  var header = {
    method: 'get',
    headers: {
      Authorization: key,
    },
  };
  var org_name = await org_info.name.replace(' ', '');

  // org_info is from realm and cannot be modified outside, find a way to make it mutable.
  // Because of this, org_data remakes the organization with its properties.
  var org_data = {
    id: org_info.id,
    name: org_info.name,
    buildings: [],
    assetGroup: [],
    checklists: []
  }
  var buildings = await get_buildings(org_name, header);
  var assetGroups = await get_assetGroup(org_name, header);
  var checklists = await get_checklists(org_name, header);
  org_data.buildings = await buildings
  org_data.assetGroup = await assetGroups
  org_data.checklists = await checklists
  return org_data;
};

get_buildings = async (org_name, header) => {

  console.log("get_buildings method");
  // gets building data from an organization api
  var buildings = [];
  var currentDate = new Date();
  var formatDate = JSON.stringify(currentDate);
  await fetch(
    `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/buildings`,
    header,
  )
    .then(response => response.json())
    .then(result => {
      buildings = result;
    })
    .catch(e => console.log(e));
  buildings.forEach(building => {
    building['lastLoaded'] = currentDate;
  });
  return buildings;
};

get_assetGroup = async (org_name, header) => {

  console.log("get_assetGroup method")
  // gets assetGroups from organization api
  var assetGroup = [];
  await fetch(
    `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/assetgroups`,
    header,
  )
    .then(response => response.json())
    .then(result => {
      var rawGroups = result
      rawGroups.forEach(assetGroup => {
        if (assetGroup.assetids == null) {
          assetGroup.assetids = [] // any assetids that are null are changed to an empty array
        }
      })
      assetGroup = rawGroups
    });
  return assetGroup;
};

get_checklists = async (org_name, header) => {
  console.log("get_checklists method")
  // Gets checklists and question from an organization
  var checklists = [];
  await fetch(
    `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/procedures`,
    header,
  )
    .then(response => response.json())
    .then(result => {
      for (var b = 0; b < result.length; b++) {
        var checklist = result[b];
        checklist['questions'] = [];
        checklists.push(checklist);
      }
    });
  var questions = await get_questions(checklists, org_name, header);

  return questions;
};

get_questions = async (checklist, org_name, header) => {

  console.log("get_questions")
  // gets questions from organization
  var checklists = checklist;
  await fetch(
    `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/procedures/questions`,
    header,
  )
    .then(response => response.json())
    .then(result => {
      for (var b = 0; b < result.length; b++) {
        //loop 1
        // loops over the list of questions
        for (var index = 0; index < checklists.length; index++) {
          // loop 2
          /**
           * Loops over each organizations checklist
           **/

          if (result[b].checklistid == checklists[index].id) {
            //if statment
            /**
             * compares the results question.checklistid to organization checklist id
             * if the id's match, the question is added into a questions list for the checklist id
             **/
            checklists[index].questions.push(result[b]);
          }
        }
      }
    });
  return checklists;
};

export const get_building_data = async(org_info, building, key) => {

  console.log("get_building_data method")
  // gets building data from api's
  var header = {
    method: 'get',
    headers: {
      Authorization: key,
    },
  };
  var currentDate = new Date();

  // buliding_info is from realm and cannot be modified outside, find a way to make it mutable.
  // Because of this, org_data remakes the organization with its properties.
  var org_name = await org_info.name.replace(' ', '');
  var building_info = {
    id: building.id,
    name: building.name,
    address: building.address,
    city: building.city,
    postal_code: building.postal_code,
    description: building.description,
    buildingnotes: building.buildingnotes,
    contacts: building.contacts,
    customer: building.customer,
    customerid: building.customerid,
    privateid: building.privateid,
    status: building.status,
    url: building.url,
    lastLoaded: building.lastLoaded,
    lastUpdated: building.lastUpdated,
    assets: [],
    spaces: [],
    qrcodes: []
  }
  
  var assetGroupList = await org_info.assetGroup;
  var allAssetId = await assetGroupList.filter(asset => asset.name == 'All Assets');
  var assets = await get_assets(org_name, allAssetId[0], building, header);
  var spaces = await get_spaces(org_name, building, header);
  var qrcodes = await get_qrcode(org_name, building, header)
  building_info.assets = await assets;
  building_info.spaces = await spaces;
  building_info.qrcodes = await qrcodes
  building_info['lastLoaded'] = currentDate;
  return building_info;
};

get_assets = async (org_name, allAssetId, buildingInfo, header) => {
  console.log("get_assets method")
  /**
   * loop each assetGroup then checks
   * if asset.buildingid matches the building.id,
   * adds the asset into building.assets[]
   */
  var building = buildingInfo;
  var Buildingid = buildingInfo.id;
  var assets = [];
  await fetch(
    `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/Assets?AssetGroupId=${allAssetId.id}&BuildingId=${Buildingid}`,
    header,
  )
    .then(response => response.json())
    .then(result => {
      result.forEach(asset => {
        // loop 4
        if (asset.buildingid == building.id) {
          // if statement
          assets.push(asset);
        }
      });
    })
    .catch(e => console.log(e));
  return assets;
};

get_spaces = async (org_name, buildingInfo, header) => {

  console.log("get_spaces method")
  // takes organization name and building info as arguments
  // gets all spaces from a building id
  var building = buildingInfo;
  var Buildingid = building.id;
  var spaces = [];
  await fetch(
    `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/v2/spaces?buildingId=${Buildingid}`,
    header,
  )
    .then(response => response.json())
    .then(result => {
      spaces = result;
    })
    .catch(e => console.log(e));
  return spaces;
};

get_qrcode = async (org_name, buildinginfo, header) => {
  console.log("get_qrcode method")
  // takes organization name, building info as arguments
  // gets the list of qr codes that belong to the building
  var buildingid = buildinginfo.id
  var qrcodemapping = [];
  try{
    await fetch(
      `${url}/sites/${org_name}/_vti_bin/wcf/orgdata.svc/QRMappings?buildingid=${buildingid}`,
      header
    )
    .then(response => response.json())
    .then(result => {
      qrcodemapping = result
    }).catch(e => console.log('get_qrcode error:', e))
    return qrcodemapping
  }catch (e) {console.log("get_qrcode error: ", e)}
}