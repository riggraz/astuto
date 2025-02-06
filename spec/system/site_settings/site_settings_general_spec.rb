require 'rails_helper'

feature 'site settings: general', type: :system, js: true do
  let(:admin) { FactoryBot.create(:admin) }


  before(:each) do
    admin.confirm
    sign_in admin
    
    visit site_settings_general_path
  end

  it 'lets edit the site name' do
    new_site_name = 'New Site Name'

    expect(page).to have_field('Site name', with: Current.tenant.site_name)

    expect(Current.tenant.site_name).not_to eq(new_site_name)

    fill_in 'Site name', with: new_site_name
    find('button', text: 'Save', match: :first).click

    within '.siteSettingsInfo' do
      expect(page).to have_content('All changes saved')
    end
    
    expect(page).to have_field('Site name', with: new_site_name)
    
    t = Tenant.first
    expect(t.site_name).to eq(new_site_name)
  end

  it 'lets edit the site language' do
    new_site_language = 'it'

    expect(Current.tenant.locale).not_to eq(new_site_language)

    select_by_value 'locale', new_site_language
    find('button', text: 'Save', match: :first).click

    within '.siteSettingsInfo' do
      expect(page).to have_content('Tutte le modifiche sono state salvate')
    end

    expect(Current.tenant.reload.locale).to eq(new_site_language)
  end
end