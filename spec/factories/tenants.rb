FactoryBot.define do
  factory :tenant do
    site_name { "MySiteName" }
    old_site_logo { "" }
    sequence(:subdomain) { |n| "mysubdomain#{n}" }
    locale { "en" }
    custom_domain { nil }
    status { "active" }
  end
end
