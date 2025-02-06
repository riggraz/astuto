require 'rails_helper'

RSpec.describe CommentPolicy do
  subject { CommentPolicy.new(user, record) }

  let(:record) { FactoryBot.create(:comment) }

  context 'being a user' do
    context 'not being the comment author' do
      let(:user) { FactoryBot.build_stubbed(:user) }

      it { should_not permit(:update) }
      it { should_not permit(:destroy) }
    end

    context 'being the post author' do
      let(:user) { FactoryBot.build(:user, id: record.user_id) }

      it { should permit(:update) }
      it { should permit(:destroy) }

      it 'permits "body", "parent_id" and "attachments" attributes for create' do
        expect(subject.permitted_attributes_for_create).to eq([:body, :parent_id, :attachments])
      end

      it 'permits "body" and "attachments" attribute for update' do
        expect(subject.permitted_attributes_for_update).to eq([:body, :attachments])
      end
    end
  end

  context 'being a moderator' do
    let(:user) { FactoryBot.build_stubbed(:moderator) }

    it { should permit(:update) }
    it { should permit(:destroy) }

    it 'permits "body", "parent_id", "is_post_update" and "attachments" attributes for create' do
      expect(subject.permitted_attributes_for_create).to eq([:body, :parent_id, :is_post_update, :attachments])
    end

    it 'permits "body", "is_post_update" and "attachments" attributes for update' do
      expect(subject.permitted_attributes_for_update).to eq([:body, :is_post_update, :attachments])
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