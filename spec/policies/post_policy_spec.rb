require 'rails_helper'

RSpec.describe PostPolicy do
  subject { PostPolicy.new(user, record) }

  let(:record) { FactoryBot.create(:post) }

  context 'being a user' do
    context 'not being the post author' do
      let(:user) { FactoryBot.build_stubbed(:user) }

      it { should_not permit(:update) }
      it { should_not permit(:destroy) }
    end

    context 'being the post author' do
      let(:user) { FactoryBot.build(:user, id: record.user_id) }

      it { should permit(:update) }
      it { should permit(:destroy) }

      it 'permits "title", "description" and "attachments" attributes' do
        expect(subject.permitted_attributes_for_update).to eq([:title, :description, :attachments])
      end
    end
  end

  context 'being a moderator' do
    let(:user) { FactoryBot.build_stubbed(:moderator) }

    it { should permit(:update) }
    it { should permit(:destroy) }

    it 'permits "title", "description", "board_id", "post_status_id", "attachments", and "approval_status" attributes' do
      permitted_attributes = [:title, :description, :board_id, :post_status_id, :attachments, :approval_status]
      expect(subject.permitted_attributes_for_update).to eq(permitted_attributes)
    end
  end

  context 'being a admin' do
    let(:user) { FactoryBot.build_stubbed(:admin) }

    it { should permit(:update) }
    it { should permit(:destroy) }
  end

  context 'being a owner' do
    let(:user) { FactoryBot.build_stubbed(:owner) }

    it { should permit(:update) }
    it { should permit(:destroy) }
  end
end