FROM ruby:2.6.3

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client
RUN npm install -g yarn

# Install Chrome (only needed for Capybara tests)
# Uncomment following lines if you need to run integration tests
# RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN dpkg -i /google-chrome-stable_current_amd64.deb; apt-get -fy install
# RUN rm /google-chrome-stable_current_amd64.deb

ENV APP_ROOT /astuto
RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}

# Launch processes in Procfile
RUN gem install foreman

# Copy Gemfile and install gems
COPY Gemfile* ${APP_ROOT}/
RUN bundle install

# Copy package.json and install packages
COPY package.json yarn.lock ${APP_ROOT}/
RUN yarn install --check-files

COPY . ${APP_ROOT}

ENTRYPOINT /bin/bash /${APP_ROOT}/docker-entrypoint.sh

EXPOSE 3000